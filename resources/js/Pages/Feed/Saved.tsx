// resources/js/Pages/Feed/Saved.tsx
import React from "react";
import { usePage } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import FeedPost from "@/Components/feed/FeedPost";
import type { FeedPrompt } from "@/Components/feed/FeedList";

type PageProps = {
  prompts: FeedPrompt[];
  nextCursor: string | null;
};

const Saved: React.FC = () => {
  const { prompts } = usePage<PageProps>().props;

  return (
    <AppLayout>
      <div className="w-full sm:max-w-2xl mx-auto px-4 pt-4 pb-10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-gray-900">
            Saved prompts
          </h1>
        </div>

        {prompts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-sm text-gray-500">
            <p>You have not saved any prompts yet.</p>
            <p className="mt-1">
              Tap the bookmark icon on a prompt to save it for later.
            </p>
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

export default Saved;
