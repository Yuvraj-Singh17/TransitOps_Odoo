import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-card text-center px-4">
      <AlertTriangle size={48} className="text-orange-400 mb-4" />
      <h1 className="text-3xl font-bold text-text-primary">404</h1>
      <p className="text-text-secondary mt-2 mb-6">The page you're looking for doesn't exist.</p>
      <Link
        to="/dashboard"
        className="bg-[#00C2FF] text-black hover:shadow-cyan-500/50 hover:shadow-lg transition-all duration-300 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#00A8E0]"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}

export default NotFound;