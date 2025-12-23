import React, { useCallback, useEffect, useRef, useState } from "react";
import FeedPost from "@/Components/feed/FeedPost";

type ActiveTab = "trending" | "text2image" | "image2text";

export type FeedPromptImage = {
  id: number;
  prompt_id: number;
  path: string;
  position: number;
  width: number | null;
  height: number | null;
};

export type FeedPromptUser = {
  id: number;
  username: string;
  avatar_url: string | null;
};

export type FeedPrompt = {
  id: number;
  title: string;
  slug: string;
  body: string;
  type: string;
  like_count: number;
  comment_count: number;
  save_count: number;
  view_count: number;
  published_at: string | null;
  user: FeedPromptUser;
  images: FeedPromptImage[];
  is_liked: boolean;
  is_saved: boolean;
};

type FeedListProps = {
  initialPrompts: FeedPrompt[];
  initialNextCursor: string | null;
};

type FeedResponse = {
  data: FeedPrompt[];
  next_cursor: string | null;
};

const FeedList: React.FC<FeedListProps> = ({
  initialPrompts,
  initialNextCursor,
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("trending");
  const [prompts, setPrompts] = useState<FeedPrompt[]>(initialPrompts);
  const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const fetchMore = useCallback(async () => {
    if (!nextCursor || isLoadingMore || activeTab !== "trending") return;

    try {
      setIsLoadingMore(true);
      setError(null);

      const params = new URLSearchParams();
      params.set("cursor", nextCursor);

      const res = await fetch(`/feed/fetch?${params.toString()}`);
      if (!res.ok) throw new Error("Failed");

      const json: FeedResponse = await res.json();
      setPrompts((prev) => [...prev, ...json.data]);
      setNextCursor(json.next_cursor);
    } catch {
      setError("Failed to load more posts.");
    } finally {
      setIsLoadingMore(false);
    }
  }, [activeTab, isLoadingMore, nextCursor]);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && fetchMore(),
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchMore]);

  return (
    <div className="w-full mx-auto">
      {/* Tabs */}
      <div className="px-4 pt-2">
        <div className="flex gap-6 text-sm border-b border-gray-200">
          <button
            type="button"
            onClick={() => setActiveTab("trending")}
            className={`pb-2 border-b-2 font-medium transition ${
              activeTab === "trending"
                ? "border-purple-600 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            Trending
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("text2image")}
            className={`pb-2 border-b-2 transition ${
              activeTab === "text2image"
                ? "border-purple-600 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            Text2Image
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("image2text")}
            className={`pb-2 border-b-2 transition ${
              activeTab === "image2text"
                ? "border-purple-600 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            Image2Text
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        {activeTab === "trending" && (
          <div className="flex flex-col gap-6 pb-10">
            {prompts.map((prompt) => (
              <FeedPost key={prompt.id} prompt={prompt} />
            ))}

            <div ref={loadMoreRef} className="h-10" />

            {isLoadingMore && (
              <p className="text-center text-sm text-gray-500">Loading...</p>
            )}

            {error && (
              <p className="text-center text-sm text-red-500">{error}</p>
            )}

            {!nextCursor && !isLoadingMore && prompts.length > 0 && (
              <p className="text-center text-xs text-gray-400 mt-4">
                You reached the end.
              </p>
            )}
          </div>
        )}

        {activeTab === "text2image" && (
          <div className="py-10 text-center text-sm text-gray-500">
            Text2Image feed / tools coming soon.
          </div>
        )}

        {activeTab === "image2text" && (
          <div className="py-10 text-center text-sm text-gray-500">
            Image2Text feed / tools coming soon.
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedList;
