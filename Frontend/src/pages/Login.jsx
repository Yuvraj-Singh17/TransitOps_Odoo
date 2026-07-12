import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Truck, Sun, Moon } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";
import axiosInstance from "../api/axiosInstance";

const loginSchema = z.object({
  identifier: z.string().min(1, "Email or phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { theme, toggleTheme } = useThemeStore();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/login", data);
      const { user, token } = res.data;

      login(user, token);
      const displayName = user.email ? user.email.split('@')[0] : 'Driver';
      toast.success(`Welcome back, ${displayName}!`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-base font-sans p-4 relative">
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 sm:top-8 sm:right-8 p-2.5 rounded-xl text-text-secondary hover:bg-bg-card transition-colors shadow-sm border border-border-dark bg-bg-base z-10 focus:outline-none focus:ring-2 focus:ring-[#00C2FF]/30"
        title="Toggle Theme"
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="flex w-full max-w-5xl bg-bg-card rounded-3xl shadow-2xl overflow-hidden border border-border-dark">
        
        {/* Left Side - Image Background */}
        <div className="hidden lg:block lg:w-1/2 relative bg-bg-card">
          <img src="/auth-bg.png" alt="Logistics Transport" className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] via-[#0B0F14]/20 to-transparent opacity-80" />
          
          <div className="absolute top-8 left-8 flex items-center gap-2">
            <img src="/logo.png" alt="TransitOps" className="h-10 w-10 object-contain rounded-xl shadow-[0_0_15px_rgba(0,194,255,0.4)]" />
            <h1 className="text-2xl font-bold text-white tracking-tight">TransitOps</h1>
          </div>
          <div className="absolute bottom-12 left-10 pr-8">
            <h2 className="text-4xl font-bold text-white leading-tight mb-2">Welcome Back</h2>
            <p className="text-text-secondary">Sign in to access the intelligent operating system for modern transport fleets.</p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center animate-fade-in bg-bg-card">
          <div className="w-full max-w-md mx-auto">
            <div className="lg:hidden flex items-center gap-2 mb-8">
              <img src="/logo.png" alt="TransitOps" className="h-10 w-10 object-contain rounded-xl shadow-[0_0_15px_rgba(0,194,255,0.4)]" />
              <h1 className="text-2xl font-bold text-text-primary tracking-tight">TransitOps</h1>
            </div>

            <h2 className="text-3xl font-bold text-text-primary mb-2">Log in</h2>
            <p className="text-text-secondary mb-8">
              Don't have an account?{" "}
              <Link to="/register" className="text-[#00C2FF] hover:underline">Sign up</Link>
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5 ml-1">Email or Phone Number</label>
                <input
                  type="text"
                  {...register("identifier")}
                  className="w-full bg-bg-base border border-border-dark rounded-xl px-4 py-3 text-text-primary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00C2FF]/50 focus:border-[#00C2FF] transition-all duration-200"
                  placeholder="you@company.com or +15551234"
                />
                {errors.identifier && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.identifier.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5 ml-1">Password</label>
                <input
                  type="password"
                  {...register("password")}
                  className="w-full bg-bg-base border border-border-dark rounded-xl px-4 py-3 text-text-primary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00C2FF]/50 focus:border-[#00C2FF] transition-all duration-200"
                  placeholder="••••••••"
                />
                {errors.password && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.password.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#00C2FF] text-black hover:shadow-[0_0_15px_rgba(0,194,255,0.4)] hover:bg-[#00A8E0] transition-all duration-300 py-3.5 rounded-xl font-medium focus:outline-none focus:ring-4 focus:ring-[#00C2FF]/30 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-2 shadow-lg shadow-[#00C2FF]/25"
              >
                {loading ? "Signing in..." : "Log in"}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;