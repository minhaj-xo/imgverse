import React from "react";
import { Link, usePage } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import { Bell, Heart, MessageCircle } from "lucide-react";

type NotificationUser = {
  id: number;
  username: string;
  avatar_url: string | null;
};

type NotificationItem = {
  id: number;
  type: "like" | "comment" | "system";
  message: string;
  link: string | null;
  created_at: string;
  is_read: boolean;
  actor?: NotificationUser | null;
};

type PageProps = {
  notifications: NotificationItem[];
};

const iconMap = {
  like: Heart,
  comment: MessageCircle,
  system: Bell,
};

const NotificationsIndex: React.FC = () => {
  const { props } = usePage<PageProps>();
  const notifications = props.notifications ?? [];

  return (
    <AppLayout>
      <div className="px-4 py-4 max-w-2xl mx-auto">
        <h1 className="text-lg font-semibold mb-4">Notifications</h1>

        {notifications.length === 0 && (
          <div className="py-20 text-center text-sm text-gray-500">
            You have no notifications yet.
          </div>
        )}

        <div className="flex flex-col divide-y divide-gray-100">
          {notifications.map((n) => {
            const Icon = iconMap[n.type] ?? Bell;

            return (
              <Link
                key={n.id}
                href={n.link || "#"}
                className={`flex gap-3 py-4 transition ${
                  n.is_read
                    ? "bg-white"
                    : "bg-purple-50 hover:bg-purple-100"
                }`}
              >
                {/* Icon / Avatar */}
                <div className="flex-shrink-0">
                  <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
                    <Icon size={18} />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-sm">
                  <p className="text-gray-800 leading-snug">
                    {n.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {n.created_at}
                  </p>
                </div>

                {/* Unread dot */}
                {!n.is_read && (
                  <div className="mt-2 h-2 w-2 rounded-full bg-purple-600" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
};

export default NotificationsIndex;
