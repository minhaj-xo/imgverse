import React from "react";
import { Link } from "@inertiajs/react";
import Header from "@/Components/navigation/Header";

const SignUp: React.FC = () => {
  const handleGoogleSignUp = () => {
    window.location.href = "/auth/google/redirect";
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-sm p-6 sm:p-8">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Join OceanPrompt
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Create your account in one click with Google.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignUp}
            className="w-full flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 active:bg-gray-100 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 0 24 24"
              width="24"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            <span>Sign up with Google</span>
          </button>

          <p className="mt-6 text-xs text-gray-400 text-center">
            No passwords, no forms — just Google. You can manage your account
            settings later.
          </p>

          <p className="mt-4 text-sm text-gray-600 text-center">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default SignUp;
