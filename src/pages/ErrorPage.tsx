/* eslint-disable react/react-in-jsx-scope */
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router";

export default function ErrorPage() {
  const navigate = useNavigate();
  const goToHome = () => {
    navigate("/");
  };

  return (
    <main className="flex h-[80vh] items-center justify-center w-full p-6">
      <div className="flex flex-col items-center justify-center max-w-md text-center space-y-6">
        <div className="p-4 bg-red-100 dark:bg-red-500/10 rounded-full shadow-sm">
          <AlertCircle className="w-16 h-16 text-red-500" />
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-400 dark:text-gray-100">
            Oops!
          </h1>
          <h2 className="text-xl font-semibold text-gray-300">
            Looks like something went wrong
          </h2>
          <p className="text-gray-300">
            It may have been an error or the page you are trying to access does not exist.
          </p>
        </div>

        <button
          onClick={goToHome}
          className="px-10 py-2 font-medium text-white transition-colors duration-200 bg-red-600 rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 cursor-pointer"
        >
          Back to home
        </button>
      </div>
    </main>
  );
}
