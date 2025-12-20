// resources/js/Pages/Profile/Show.tsx
import React from "react";
import { Link, usePage } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import FeedPost from "@/Components/feed/FeedPost";
import type { SharedData } from "@/types";
import type { FeedPrompt } from "@/Components/feed/FeedList";

type ProfileUser = {
  id: number;
  username: string;
  name: string | null;
  avatar_url: string | null;
  bio: string | null;
  website_url: string | null;
  location: string | null;
  followers_count: number;
  following_count: number;
  prompts_count: number;
};

type PageProps = SharedData & {
  profileUser: ProfileUser;
  prompts: FeedPrompt[];
};

const ProfileShow: React.FC = () => {
  const { auth, profileUser, prompts } = usePage<PageProps>().props;

  const isMe = !!auth?.user && auth.user.id === profileUser.id;

  const displayName = profileUser.name || profileUser.username;
  const initials =
    profileUser.name?.charAt(0)?.toUpperCase() ??
    profileUser.username.charAt(0).toUpperCase();

  return (
    <AppLayout>
      <div className="w-full sm:max-w-2xl mx-auto px-4 pt-4 pb-10">
        <div className="flex items-start gap-4 mb-6">
          {profileUser.avatar_url ? (
            <img
              src={profileUser.avatar_url}
              alt={profileUser.username}
              className="w-16 h-16 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-purple-600 text-white flex items-center justify-center text-xl font-semibold">
              {initials}
            </div>
          )}

          <div className="flex-1">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {displayName}
                </h1>
                <p className="text-sm text-gray-500">@{profileUser.username}</p>
              </div>

              {isMe && (
                <Link
                  href="/settings/profile"
                  className="text-xs sm:text-sm px-3 py-1.5 rounded-full border border-gray-300 text-gray-800 hover:bg-gray-50"
                >
                  Edit profile
                </Link>
              )}
            </div>

            <div className="flex flex-wrap gap-4 mt-3 text-xs sm:text-sm text-gray-700">
              <span>
                <span className="font-semibold">
                  {profileUser.prompts_count}
                </span>{" "}
                prompts
              </span>
              <span>
                <span className="font-semibold">
                  {profileUser.followers_count}
                </span>{" "}
                followers
              </span>
              <span>
                <span className="font-semibold">
                  {profileUser.following_count}
                </span>{" "}
                following
              </span>
            </div>

            {profileUser.bio && (
              <p className="mt-3 text-sm text-gray-800 whitespace-pre-line">
                {profileUser.bio}
              </p>
            )}

            <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-600">
              {profileUser.location && (
                <span className="truncate">{profileUser.location}</span>
              )}
              {profileUser.website_url && (
                <a
                  href={profileUser.website_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-purple-600 hover:text-purple-700 truncate"
                >
                  {profileUser.website_url.replace(/^https?:\/\//, "")}
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200 mb-4 pb-2">
          <h2 className="text-sm font-medium text-gray-700">
            {isMe ? "Your prompts" : "Prompts"}
          </h2>
        </div>

        {prompts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-sm text-gray-500">
            {isMe ? (
              <>
                <p>You have not posted any prompts yet.</p>
                <p className="mt-1">
                  Share your first prompt from the Post button.
                </p>
              </>
            ) : (
              <p>This user has not posted any prompts yet.</p>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {prompts.map((prompt) => (
              <FeedPost key={prompt.id} prompt={prompt} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ProfileShow;
