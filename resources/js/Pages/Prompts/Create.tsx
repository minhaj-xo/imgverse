import React, { useEffect, useState } from "react";
import { ChevronLeft, X, UploadCloud, Layout, FileCode, PlusCircle } from "lucide-react";
import { Link, useForm } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";

const modelOptions = [
  { value: "gpt-4.1-mini", label: "GPT-4.1 Mini" },
  { value: "gpt-4.1", label: "GPT-4.1" },
  { value: "claude-3.5", label: "Claude 3.5" },
  { value: "custom", label: "Custom model" },
];

type ImagePreview = {
  url: string;
};

export default function Create() {
  const [activeTab, setActiveTab] = useState<"basic" | "details">("basic");
  
  const { data, setData, post, processing, errors, reset } = useForm({
    title: "",
    description: "",
    content: "", 
    ai_model: modelOptions[0].value,
    images: [] as File[],
  });

  const [previews, setPreviews] = useState<ImagePreview[]>([]);

  useEffect(() => {
    return () => previews.forEach((p) => URL.revokeObjectURL(p.url));
  }, [previews]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setData("images", [...data.images, ...files]);
    const newPreviews = files.map((file) => ({ url: URL.createObjectURL(file) }));
    setPreviews([...previews, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    const newImages = [...data.images];
    newImages.splice(index, 1);
    setData("images", newImages);
    URL.revokeObjectURL(previews[index].url);
    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/prompts", {
      forceFormData: true,
      onSuccess: () => {
        reset();
        setPreviews([]);
      },
    });
  };

  // Only title is required for a quick post
  const canSubmit = data.title.trim().length > 0;

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-purple-600 transition-colors mb-6 group"
        >
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to feed</span>
        </Link>

        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create a post</h1>
          <p className="text-gray-500 mt-1">Share your ideas, prompts, or AI generation results.</p>
        </header>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-8" role="tablist">
          <button
            onClick={() => setActiveTab("basic")}
            role="tab"
            aria-selected={activeTab === "basic"}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all border-b-2 ${
              activeTab === "basic"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Layout size={18} />
            Essentials
          </button>
          <button
            onClick={() => setActiveTab("details")}
            role="tab"
            aria-selected={activeTab === "details"}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all border-b-2 ${
              activeTab === "details"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <FileCode size={18} />
            Technical Details
            {(previews.length > 0 || data.content) && (
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            )}
          </button>
        </div>

        {/* Global Error Alert */}
        {Object.keys(errors).length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            <p className="font-bold">Please fix the following errors:</p>
            <ul className="list-disc ml-5">
            {Object.values(errors).map((error, i) => (
                <li key={i}>{error}</li>
            ))}
            </ul>
        </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* TAB 1: ESSENTIALS */}
          <div className={activeTab === "basic" ? "block animate-in fade-in duration-300" : "hidden"}>
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-bold text-gray-800 mb-2">
                  Post Title <span className="text-purple-600">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  autoFocus
                  required
                  aria-required="true"
                  value={data.title}
                  onChange={(e) => setData("title", e.target.value)}
                  className={`w-full text-lg px-4 py-3 rounded-xl border-gray-200 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-all ${
                    errors.title ? "border-red-500 bg-red-50" : "bg-gray-50/50"
                  }`}
                  placeholder="e.g., Cyberpunk Street Photography Prompt"
                />
                {errors.title && <p className="mt-2 text-sm text-red-600 flex items-center gap-1"><X size={14}/> {errors.title}</p>}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-bold text-gray-800 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={data.description}
                  onChange={(e) => setData("description", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-gray-200 bg-gray-50/50 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-all"
                  placeholder="Share the context or story behind this prompt..."
                />
              </div>
            </div>
          </div>

          {/* TAB 2: TECHNICAL DETAILS */}
          <div className={activeTab === "details" ? "block animate-in fade-in duration-300" : "hidden"}>
            <div className="space-y-6">
              <div>
                <label htmlFor="ai_model" className="block text-sm font-bold text-gray-800 mb-2">AI Model</label>
                <select
                  id="ai_model"
                  value={data.ai_model}
                  onChange={(e) => setData("ai_model", e.target.value)}
                  className="w-full rounded-xl border-gray-200 bg-gray-50/50 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                >
                  {modelOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-bold text-gray-800 mb-2">The Raw Prompt</label>
                <textarea
                  id="content"
                  rows={6}
                  value={data.content}
                  onChange={(e) => setData("content", e.target.value)}
                  className="w-full font-mono text-sm px-4 py-3 rounded-xl border-gray-200 bg-gray-900 text-purple-100 placeholder-purple-300/30 shadow-inner focus:border-purple-500 focus:ring-purple-500"
                  placeholder="/imagine prompt: a futuristic..."
                />
              </div>

              <div>
                <span className="block text-sm font-bold text-gray-800 mb-3">Result Images</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {previews.map((preview, index) => (
                    <div key={index} className="relative group aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
                      <img src={preview.url} className="w-full h-full object-cover" alt={`Preview ${index + 1}`} />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-md"
                        aria-label="Remove image"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  
                  <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all group">
                    <div className="bg-white p-3 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                      <PlusCircle className="text-purple-600" size={24} />
                    </div>
                    <span className="mt-2 text-xs font-bold text-gray-500 uppercase tracking-widest">Add Image</span>
                    <input type="file" multiple className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Persistent Sticky Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-100 mt-10">
            <div className="text-xs text-gray-400 font-medium">
              {activeTab === "basic" ? "Pro-tip: Technical details are optional!" : "Almost done! You can post from any tab."}
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => { reset(); setPreviews([]); }}
                className="flex-1 sm:flex-none px-6 py-3 text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors"
              >
                Clear all
              </button>
              <button
                type="submit"
                disabled={processing || !canSubmit}
                className={`flex-1 sm:flex-none px-10 py-3 rounded-full text-white font-bold text-sm shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${
                  canSubmit 
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-purple-200" 
                  : "bg-gray-300 cursor-not-allowed shadow-none"
                }`}
              >
                {processing ? "Uploading..." : "Publish Post"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}