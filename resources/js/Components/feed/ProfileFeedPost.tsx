import React, { useCallback, useState, useRef, useEffect } from "react";
import {
  Bookmark,
  ChevronRight,
  Heart,
  MessageCircleMore,
  Send,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { Link, router, usePage } from "@inertiajs/react";
import type { FeedPrompt } from "@/Components/feed/FeedList";
import type { SharedData } from "@/types";

type ProfileFeedPostProps = {
  prompt: FeedPrompt;
  isOwner: boolean;
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
  if (diffDay < 1) return `${diffHour} hr${diffHour > 1 ? "s" : ""} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString();
};

const ProfileFeedPost: React.FC<ProfileFeedPostProps> = ({ prompt, isOwner }) => {
  const { auth } = usePage<SharedData>().props;
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // States for Likes/Saves
  const [isLiked, setIsLiked] = useState(prompt.is_liked);
  const [likeCount, setLikeCount] = useState(prompt.like_count);
  const [isSaved, setIsSaved] = useState(prompt.is_saved);
  const [saveCount, setSaveCount] = useState(prompt.save_count);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this prompt? This action cannot be undone.")) {
      router.delete(`/prompts/${prompt.id}`, {
        onBefore: () => setShowDropdown(false),
      });
    }
  };

  const images = prompt.images ?? [];
  const currentImage = images[currentImageIndex] ?? images[0] ?? null;
  const published = prompt.published_at ? new Date(prompt.published_at) : null;
  const timeLabel = published ? formatTimeAgo(published) : "";
  const promptUrl = `/prompts/${prompt.id}-${prompt.slug}`;

  // ... (keeping your handleLikeClick, handleSaveClick, handleShareClick logic)
  const handleLikeClick = async () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    router.post(`/prompts/${prompt.id}/like`, {}, { preserveScroll: true });
  };

  const handleSaveClick = async () => {
    setIsSaved(!isSaved);
    setSaveCount(prev => isSaved ? prev - 1 : prev + 1);
    router.post(`/prompts/${prompt.id}/save`, {}, { preserveScroll: true });
  };

  return (
    <div className="flex flex-col border border-gray-200 rounded-sm bg-white relative">
      <div className="flex items-center justify-between py-2 px-4">
        <div className="flex items-center gap-2">
          <img
            className="w-7 aspect-square rounded-full border border-purple-500 object-cover"
            src={prompt.user.avatar_url ?? "https://ui-avatars.com/api/?name=" + prompt.user.username}
            alt={prompt.user.username}
          />
          <div className="flex flex-col">
            <h2 className="text-xs font-bold text-gray-900">u/{prompt.user.username}</h2>
            <div className="text-[10px] text-gray-500">{timeLabel}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isOwner && (
            <div className="text-white bg-blue-600 rounded-full px-3 py-1 text-xs font-semibold cursor-pointer">
              Follow
            </div>
          )}
          
          {isOwner && (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <MoreVertical size={18} className="text-gray-500" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
                  <button
                    onClick={handleDelete}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} />
                    <span>Delete Post</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Link href={promptUrl} className="contents">
        <div className="px-4">
          <h3 className="text-gray-800 font-bold text-base leading-snug">{prompt.title}</h3>
          <p className="my-1 line-clamp-3 text-gray-700 text-sm">{prompt.body}</p>
        </div>

        {currentImage && (
          <div className="relative w-full flex items-center flex-col mt-2">
            <img className="aspect-square w-full object-cover" src={`/storage/${currentImage.path}`} alt={prompt.title} />
          </div>
        )}

        <div className="flex gap-2 px-4 py-3 text-sm items-center border-t border-gray-50 mt-2">
          <p className="font-bold text-purple-600">Prompt</p>
          <p className="line-clamp-1 text-gray-500 flex-1">{prompt.body}</p>
          <ChevronRight size={18} className="text-gray-400" />
        </div>
      </Link>

      <div className="flex gap-2 items-center px-4 justify-around py-2 border-t border-gray-50 text-sm">
        <button onClick={handleLikeClick} className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 rounded-full py-1.5 px-4 transition-colors">
          <Heart size={18} className={isLiked ? "text-red-500 fill-red-500" : "text-gray-500"} />
          <span className="font-medium">{likeCount}</span>
        </button>

        <Link href={`${promptUrl}#comments`} className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 rounded-full py-1.5 px-4">
          <MessageCircleMore size={18} className="text-gray-500" />
          <span className="font-medium">{prompt.comment_count}</span>
        </Link>

        <button onClick={handleSaveClick} className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 rounded-full py-1.5 px-4">
          <Bookmark size={18} className={isSaved ? "text-purple-600 fill-purple-600" : "text-gray-500"} />
          <span className="font-medium">{saveCount}</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileFeedPost;