import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <AlertTriangle size={48} className="text-orange-400 mb-4" />
      <h1 className="text-3xl font-bold text-gray-800">404</h1>
      <p className="text-gray-500 mt-2 mb-6">The page you're looking for doesn't exist.</p>
      <Link
        to="/dashboard"
        className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}

export default NotFound;