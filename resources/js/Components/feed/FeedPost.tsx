import React, { useCallback, useState } from "react";
import {
  Bookmark,
  ChevronRight,
  Heart,
  MessageCircleMore,
  Send,
} from "lucide-react";
import { Link, router, usePage } from "@inertiajs/react";
import type { FeedPrompt } from "@/Components/feed/FeedList";
import type { SharedData } from "@/types";

type FeedPostProps = {
  prompt: FeedPrompt;
};

const formatTimeAgo = (date: Date): string => {
  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffHour < 1) {
    const minutes = Math.max(diffMin, 1);
    return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
  }

  if (diffDay < 1) {
    return `${diffHour} hr${diffHour > 1 ? "s" : ""} ago`;
  }

  if (diffDay < 7) {
    return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
  }

  return date.toLocaleDateString();
};

const getCsrfToken = (): string => {
  if (typeof document === "undefined") {
    return "";
  }
  const meta = document.querySelector(
    'meta[name="csrf-token"]'
  ) as HTMLMetaElement | null;
  return meta?.content ?? "";
};

const FeedPost: React.FC<FeedPostProps> = ({ prompt }) => {
  const { auth } = usePage<SharedData>().props;
  const isLoggedIn = !!auth?.user;

  const [isLiked, setIsLiked] = useState<boolean>(prompt.is_liked);
  const [likeCount, setLikeCount] = useState<number>(prompt.like_count);
  const [isSaved, setIsSaved] = useState<boolean>(prompt.is_saved);
  const [saveCount, setSaveCount] = useState<number>(prompt.save_count);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = prompt.images ?? [];
  const currentImage = images[currentImageIndex] ?? images[0] ?? null;
  const imageCount = images.length;

  const published =
    prompt.published_at !== null ? new Date(prompt.published_at) : null;
  const timeLabel = published ? formatTimeAgo(published) : "";

  const avatar =
    prompt.user.avatar_url ??
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  const promptUrl = `/prompts/${prompt.id}-${prompt.slug}`;

  const requireAuth = useCallback((): boolean => {
    if (!isLoggedIn) {
      router.visit("/login");
      return false;
    }
    return true;
  }, [isLoggedIn]);

  const handleLikeClick = useCallback(async () => {
    if (!requireAuth()) {
      return;
    }

    const csrfToken = getCsrfToken();
    const nextLiked = !isLiked;

    setIsLiked(nextLiked);
    setLikeCount((prev) => prev + (nextLiked ? 1 : -1));

    try {
      await fetch(`/prompts/${prompt.id}/like`, {
        method: "POST",
        headers: {
          "X-CSRF-TOKEN": csrfToken,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
    } catch {
      setIsLiked(!nextLiked);
      setLikeCount((prev) => prev + (nextLiked ? -1 : 1));
    }
  }, [isLiked, prompt.id, requireAuth]);

  const handleSaveClick = useCallback(async () => {
    if (!requireAuth()) {
      return;
    }

    const csrfToken = getCsrfToken();
    const nextSaved = !isSaved;

    setIsSaved(nextSaved);
    setSaveCount((prev) => prev + (nextSaved ? 1 : -1));

    try {
      await fetch(`/prompts/${prompt.id}/save`, {
        method: "POST",
        headers: {
          "X-CSRF-TOKEN": csrfToken,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
    } catch {
      setIsSaved(!nextSaved);
      setSaveCount((prev) => prev + (nextSaved ? -1 : 1));
    }
  }, [isSaved, prompt.id, requireAuth]);

  const handleShareClick = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    const url = `${window.location.origin}${promptUrl}`;
    const text = prompt.title;

    if (navigator.share) {
      navigator
        .share({
          title: text,
          text,
          url,
        })
        .catch(() => {});
      return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).catch(() => {});
      return;
    }
  }, [prompt.title, promptUrl]);

  const handleDotClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="flex flex-col border border-gray-200 rounded-xs bg-white">
      <div className="flex items-center justify-between py-2 px-4">
        <div className="flex items-center gap-2">
          <img
            className="w-7 aspect-square rounded-full border border-purple-500 object-cover"
            src={avatar}
            alt={prompt.user.username}
          />
          <div className="flex flex-col">
            <h2 className="text-xs text-gray-900">
              u/{prompt.user.username}
            </h2>
            <div className="text-xs text-gray-500">{timeLabel}</div>
          </div>
        </div>
        <div className="text-white bg-blue-600 rounded-full px-2 py-1 text-xs font-semibold">
          Follow
        </div>
      </div>

      <Link href={promptUrl} className="contents">
        <div>
          <h3 className="px-4 text-gray-800 font-semibold text-base leading-snug">
            {prompt.title}
          </h3>
          <p className="px-4 my-1 line-clamp-3 text-gray-700 text-sm">
            {prompt.body}
          </p>
        </div>

        {currentImage && (
          <div className="relative w-full flex items-center flex-col">
            <img
  className="aspect-square object-cover"
  src={`/storage/${currentImage.path}`} // Add /storage/ here
  alt={prompt.title}
/>
            {imageCount > 1 && (
              <div className="absolute rounded-full w-fit bg-gray-700 bg-opacity-25 py-1 px-2 flex gap-1 bottom-2 items-center justify-center">
                {images.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDotClick(index);
                    }}
                    className={`w-[5px] aspect-square rounded-full ${
                      index === currentImageIndex
                        ? "bg-white"
                        : "bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2 px-4 py-2 text-sm">
          <p className="font-semibold text-purple-500">Prompt</p>
          <p className="line-clamp-1 text-gray-700">{prompt.body}</p>
          <div className="text-gray-700">
            <ChevronRight size={20} />
          </div>
        </div>
      </Link>

      <div className="flex gap-2 items-center px-4 justify-around py-1 pb-2 text-sm">
        <button
          type="button"
          onClick={handleLikeClick}
          className="flex items-center gap-1 bg-gray-100 rounded-full py-1 px-3"
        >
          <Heart
            size={20}
            className={isLiked ? "text-red-500 fill-red-500" : ""}
          />
          <span>{likeCount}</span>
        </button>

        <Link
          href={`${promptUrl}#comments`}
          className="flex items-center gap-1 bg-gray-100 rounded-full py-1 px-3"
        >
          <MessageCircleMore size={20} />
          <span>{prompt.comment_count}</span>
        </Link>

        <button
          type="button"
          onClick={handleSaveClick}
          className="flex items-center gap-1 bg-gray-100 rounded-full py-1 px-3"
        >
          <Bookmark
            size={20}
            className={isSaved ? "text-purple-600 fill-purple-600" : ""}
          />
          <span>{saveCount}</span>
        </button>

        <button
          type="button"
          onClick={handleShareClick}
          className="flex items-center gap-1 bg-gray-100 rounded-full py-1 px-3"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default FeedPost;
