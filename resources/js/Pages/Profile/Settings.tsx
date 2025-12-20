import React, { FormEvent, useMemo, useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import type { SharedData } from "@/types";

type ProfileFormUser = {
  id: number;
  username: string;
  name: string | null;
  bio: string | null;
  website_url: string | null;
  location: string | null;
  avatar_url: string | null;
  email: string | null;
};

type PageProps = SharedData & {
  user: ProfileFormUser;
};

const Settings: React.FC = () => {
  const { user } = usePage<PageProps>().props;
  const [avatarError, setAvatarError] = useState<string | null>(null);

  const { data, setData, put, processing, errors } = useForm({
    name: user.name ?? "",
    bio: user.bio ?? "",
    website_url: user.website_url ?? "",
    location: user.location ?? "",
    avatar: null as File | null,
  });

  const avatarPreviewUrl = useMemo(() => {
    if (data.avatar instanceof File) {
      return URL.createObjectURL(data.avatar);
    }
    return user.avatar_url ?? null;
  }, [data.avatar, user.avatar_url]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarError(null);

    const file = e.target.files?.[0];
    if (!file) {
      setData("avatar", null);
      return;
    }

    if (file.size > 1024 * 1024) {
      setAvatarError("Avatar must be 1 MB or smaller.");
      setData("avatar", null);
      return;
    }

    setData("avatar", file);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setAvatarError(null);

    put("/settings/profile", {
      forceFormData: true,
    });
  };

  const initials =
    user.name?.charAt(0)?.toUpperCase() ??
    user.username.charAt(0).toUpperCase();

  return (
    <AppLayout>
      <div className="w-full sm:max-w-xl mx-auto px-4 pt-4 pb-10">
        <h1 className="text-lg font-semibold text-gray-900 mb-4">
          Edit profile
        </h1>

        <div className="mb-5 text-xs text-gray-500">
          <p>Only you can edit this information.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex items-center gap-4">
            {avatarPreviewUrl ? (
              <img
                src={avatarPreviewUrl}
                alt={user.username}
                className="w-16 h-16 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-purple-600 text-white flex items-center justify-center text-xl font-semibold">
                {initials}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-gray-700">
                Profile photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="text-xs"
              />
              <p className="text-[10px] text-gray-400">
                Max size 1 MB. Square images work best.
              </p>
              {avatarError && (
                <p className="text-xs text-red-500">{avatarError}</p>
              )}
              {errors.avatar && (
                <p className="text-xs text-red-500">{errors.avatar}</p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-700">
              Display name
            </label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
              className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
              maxLength={100}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-700">
              Bio
            </label>
            <textarea
              value={data.bio}
              onChange={(e) => setData("bio", e.target.value)}
              className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
              rows={3}
              maxLength={280}
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
              <span>Short description about you.</span>
              <span>{data.bio.length}/280</span>
            </div>
            {errors.bio && (
              <p className="text-xs text-red-500 mt-1">{errors.bio}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              value={data.location}
              onChange={(e) => setData("location", e.target.value)}
              className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
              maxLength={100}
            />
            {errors.location && (
              <p className="text-xs text-red-500 mt-1">{errors.location}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-700">
              Website
            </label>
            <input
              type="url"
              value={data.website_url}
              onChange={(e) => setData("website_url", e.target.value)}
              className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
              placeholder="https://example.com"
            />
            {errors.website_url && (
              <p className="text-xs text-red-500 mt-1">
                {errors.website_url}
              </p>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={processing}
              className="inline-flex items-center px-4 py-2 text-sm rounded-full bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {processing ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
};

export default Settings;
