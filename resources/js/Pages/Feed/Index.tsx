import React from "react";
import { usePage } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import FeedList from "@/Components/feed/FeedList";
import type { FeedPrompt } from "@/Components/feed/FeedList";

type PageProps = {
  prompts: FeedPrompt[];
  nextCursor: string | null;
  sort: "trending" | "new";
};

const Index: React.FC = () => {
  const { props } = usePage<PageProps>();

  return (
    <AppLayout>
      <FeedList
        initialPrompts={props.prompts}
        initialNextCursor={props.nextCursor}
      />
    </AppLayout>
  );
};

export default Index;
