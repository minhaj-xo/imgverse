import React, { useState } from "react";
import { Link, Head, useForm } from "@inertiajs/react";
import {
  Bookmark,
  ChevronLeft,
  Copy,
  Heart,
  MessageCircleMore,
  Send,
  Info,
  Check,
} from "lucide-react";
import AppLayout from "@/Layouts/AppLayout";

interface Props {
  prompt: {
    id: number;
    title: string;
    description: string;
    content: string; // The raw prompt text
    ai_model: string;
    image_urls: string[];
    user: {
      username: string;
      avatar: string;
    };
    created_at_human: string;
    stats: {
      likes: number;
      comments_count: number;
    };
  };
  comments: Array<{
    id: number;
    user: string;
    time: string;
    text: string;
  }>;
}

export default function Show({ prompt, comments: initialComments }: Props) {
  const [copied, setCopied] = useState(false);

  // Using Inertia useForm for the comment box
  const { data, setData, post, processing, reset } = useForm({
    comment: "",
  });

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const submitComment = (e: React.FormEvent) => {
    e.preventDefault();
    // Path based on: Route::post('/prompts/{prompt}/comments')
    post(`/prompts/${prompt.id}/comments`, {
      preserveScroll: true,
      onSuccess: () => reset('comment'),
    });
  };

  const handleLike = () => {
    // Path based on: Route::post('/prompts/{prompt}/like')
    post(`/prompts/${prompt.id}/like`, {
      preserveScroll: true,
    });
  };

  const handleSave = () => {
    // Path based on: Route::post('/prompts/{prompt}/save')
    post(`/prompts/${prompt.id}/save`, {
      preserveScroll: true,
    });
  };

  return (
    <AppLayout>
      <Head title={prompt.title} />

      <div className="max-w-3xl mx-auto px-4 pt-6 pb-20">
        {/* Navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-purple-600 transition-colors mb-6 group"
        >
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to feed</span>
        </Link>

        {/* Main Content Card */}
        <article className="bg-white border border-gray-200 rounded-xs overflow-hidden">
          
          {/* Author Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-50">
            <div className="flex items-center gap-3">
              <img
                src={prompt.user.avatar}
                className="w-10 h-10 rounded-full border border-purple-100 object-cover"
                alt={prompt.user.username}
              />
              <div>
                <Link 
                  href={`/u/${prompt.user.username}`} 
                  className="block text-sm font-bold text-gray-900 hover:text-purple-600"
                >
                  u/{prompt.user.username}
                </Link>
                <span className="text-[11px] text-gray-500 font-medium uppercase tracking-tight">
                  {prompt.created_at_human}
                </span>
              </div>
            </div>
            <button className="text-xs font-bold bg-gray-900 text-white rounded-full px-4 py-2 hover:bg-purple-600 transition-colors">
              Follow
            </button>
          </div>

          {/* Text Content */}
          <div className="px-6 py-5">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight leading-tight mb-3">
              {prompt.title}
            </h1>
            <p className="text-gray-600 leading-relaxed">
              {prompt.description}
            </p>
          </div>

          {/* Image Display */}
          <div className="bg-gray-50 grid grid-cols-1 gap-1">
            {prompt.image_urls.map((url, i) => (
              <img key={i} src={url} className="w-full h-auto object-contain" alt={`Generation ${i}`} />
            ))}
          </div>

          {/* Technical Section (The "Raw Prompt") */}
          <div className="p-6 bg-white border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-purple-100 text-purple-600 rounded-md">
                  <Info size={16} />
                </div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Technical Details
                </h3>
              </div>
              <button
                onClick={handleCopyPrompt}
                className={`cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  copied ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Copied!" : "Copy Prompt"}
              </button>
            </div>

            <div className="bg-gray-900 rounded-xl p-4 mb-4 shadow-inner">
              <code className="text-sm font-mono text-purple-200 leading-relaxed block break-words">
                {prompt.content}
              </code>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-bold">
              Model: {prompt.ai_model}
            </div>
          </div>

          {/* Social Interactions */}
          <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
            <div className="flex gap-4">
              <button 
                onClick={handleLike}
                className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors group"
              >
                <Heart size={20} className="group-active:scale-125 transition-transform" />
                <span className="text-sm font-bold">{prompt.stats.likes}</span>
              </button>
              <button className="flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-colors">
                <MessageCircleMore size={20} />
                <span className="text-sm font-bold">{prompt.stats.comments_count}</span>
              </button>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleSave}
                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-white rounded-full transition-all"
              >
                <Bookmark size={20} />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-white rounded-full transition-all">
                <Send size={20} />
              </button>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <section className="mt-10">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Discussion</h2>

          {/* Comment Form */}
          <form onSubmit={submitComment} className="mb-8">
            <div className="bg-white border border-gray-200 rounded-xs p-4">
              <textarea
                value={data.comment}
                onChange={(e) => setData("comment", e.target.value)}
                placeholder="Add a comment..."
                className="w-full p-2 border-none text-sm text-gray-800 resize-none min-h-[60px]"
              />
              <div className="flex justify-end pt-2 border-t border-gray-50 mt-2">
                <button
                  type="submit"
                  disabled={processing || !data.comment.trim()}
                  className="bg-purple-600 text-white text-xs font-bold px-5 py-2 rounded-full disabled:opacity-50 hover:bg-purple-700 transition-colors"
                >
                  {processing ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {initialComments.map((comment) => (
              <div key={comment.id} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex-shrink-0" />
                <div className="flex-1">
                  <div className="bg-white border border-gray-100 rounded-xs px-4 py-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-gray-900">{comment.user}</span>
                      <span className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">{comment.time}</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{comment.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}