import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import FeedPost from "@/Components/feed/FeedPost";

type ActiveTab = "trending" | "text2image" | "image2text";
type SortOption = "trending" | "new" | "top";

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
  initialSort: "trending" | "new";
};

type FeedResponse = {
  data: FeedPrompt[];
  next_cursor: string | null;
};

const sortLabelMap: Record<SortOption, string> = {
  trending: "Trending",
  new: "New",
  top: "Top",
};

const FeedList: React.FC<FeedListProps> = ({
  initialPrompts,
  initialNextCursor,
  initialSort,
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("trending");
  const [sortOption, setSortOption] = useState<SortOption>(
    initialSort === "new" ? "new" : "trending"
  );
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [prompts, setPrompts] = useState<FeedPrompt[]>(initialPrompts);
  const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const backendSort = (option: SortOption): "trending" | "new" => {
    if (option === "new") {
      return "new";
    }
    return "trending";
  };

  const fetchPage = useCallback(
    async (params: { sort: SortOption; cursor?: string | null }) => {
      const sort = backendSort(params.sort);
      const searchParams = new URLSearchParams();
      searchParams.set("sort", sort);
      if (params.cursor) {
        searchParams.set("cursor", params.cursor);
      }

      const response = await fetch(`/feed/fetch?${searchParams.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to load posts");
      }
      const json: FeedResponse = await response.json();
      return json;
    },
    []
  );

  const fetchMore = useCallback(async () => {
    if (!nextCursor || isLoadingMore || activeTab !== "trending") {
      return;
    }
    try {
      setIsLoadingMore(true);
      setError(null);
      const json = await fetchPage({ sort: sortOption, cursor: nextCursor });
      setPrompts((prev) => [...prev, ...json.data]);
      setNextCursor(json.next_cursor);
    } catch (e) {
      setError("Failed to load more posts.");
    } finally {
      setIsLoadingMore(false);
    }
  }, [activeTab, fetchPage, isLoadingMore, nextCursor, sortOption]);

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          fetchMore();
        }
      },
      {
        rootMargin: "200px",
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [fetchMore]);

  const handleTabClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setIsSortOpen(false);
  };

  const handleSortChange = async (option: SortOption) => {
    setSortOption(option);
    setIsSortOpen(false);

    if (activeTab !== "trending") {
      return;
    }

    try {
      setIsLoadingMore(true);
      setError(null);
      const json = await fetchPage({ sort: option });
      setPrompts(json.data);
      setNextCursor(json.next_cursor);
    } catch (e) {
      setError("Failed to load posts.");
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="w-full sm:max-w-2xl items-center mx-auto">
      <div className="px-4 pt-2">
        <div className="flex gap-6 text-sm border-b border-gray-200">
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                if (activeTab !== "trending") {
                  setActiveTab("trending");
                  setIsSortOpen(false);
                } else {
                  setIsSortOpen((prev) => !prev);
                }
              }}
              className={`flex items-center gap-1 pb-2 border-b-2 transition-all duration-200 ease-out ${
                activeTab === "trending"
                  ? "border-purple-600 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              <span className="font-medium">
                {activeTab === "trending"
                  ? sortLabelMap[sortOption]
                  : "Trending"}
              </span>
              {activeTab === "trending" && (
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    isSortOpen ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>

            {activeTab === "trending" && isSortOpen && (
              <div className="absolute left-0 mt-1 w-32 rounded-md bg-white border border-gray-100 py-1 text-xs z-10">
                {(["trending", "new", "top"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleSortChange(option)}
                    className={`block w-full text-left px-3 py-1.5 transition-colors duration-150 ${
                      option === sortOption
                        ? "text-purple-600 font-medium bg-gray-50"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {sortLabelMap[option]}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleTabClick("text2image")}
            className={`pb-2 border-b-2 transition-all duration-200 ease-out ${
              activeTab === "text2image"
                ? "border-purple-600 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <span className="font-medium">Text2Image</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabClick("image2text")}
            className={`pb-2 border-b-2 transition-all duration-200 ease-out ${
              activeTab === "image2text"
                ? "border-purple-600 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <span className="font-medium">Image2Image</span>
          </button>
        </div>
      </div>

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
          <div className="flex flex-col gap-6 pb-10 items-center justify-center text-center">
            <p className="text-sm text-gray-500">
              Text2Image feed / tools coming soon.
            </p>
          </div>
        )}

        {activeTab === "image2text" && (
          <div className="flex flex-col gap-6 pb-10 items-center justify-center text-center">
            <p className="text-sm text-gray-500">
              Image2Text feed / tools coming soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedList;
