import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Truck } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import axiosInstance from "../api/axiosInstance";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
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
      toast.success(`Welcome back, ${user.name}!`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0F172A] font-sans">
      {/* Left Side - Visual/Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500 text-white relative overflow-hidden flex-col justify-center items-center p-12">
        {/* Decorative Circles */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#121821]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-brand-500/50 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 text-center animate-fade-in-up">
          <div className="bg-[#121821]/20 p-4 rounded-2xl inline-block mb-6 backdrop-blur-sm border border-white/30">
            <Truck size={48} className="text-white" />
          </div>
          <h1 className="text-5xl font-bold font-heading mb-4 tracking-tight">TransitOps</h1>
          <p className="text-xl text-brand-100 max-w-md font-light leading-relaxed">
            The intelligent operating system for modern transport and logistics fleets.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 animate-fade-in">
        <div className="w-full max-w-md glass-panel p-8 sm:p-10 rounded-3xl">
          <div className="text-center mb-10">
            <div className="lg:hidden bg-[#00C2FF]/10 p-3 rounded-2xl inline-block mb-4 text-[#00C2FF]">
              <Truck size={32} />
            </div>
            <h2 className="text-3xl font-bold font-heading text-white mb-2">Welcome Back</h2>
            <p className="text-[#9CA3AF]">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#E5E7EB] mb-1.5 ml-1">Email Address</label>
              <input
                type="email"
                {...register("email")}
                className="w-full bg-[#121821] border border-[#1F2937] rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all duration-200"
                placeholder="you@company.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5 ml-1 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-red-500"></span>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#E5E7EB] mb-1.5 ml-1">Password</label>
              <input
                type="password"
                {...register("password")}
                className="w-full bg-[#121821] border border-[#1F2937] rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all duration-200"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1.5 ml-1 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-red-500"></span>
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00C2FF] text-black hover:shadow-cyan-500/50 hover:shadow-lg transition-all duration-300 py-3.5 rounded-xl font-medium hover:bg-[#00A8E0] focus:outline-none focus:ring-4 focus:ring-brand-500/30 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 mt-2 shadow-lg shadow-brand-500/25"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
          
          <p className="text-center text-sm text-[#9CA3AF] mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#00C2FF] font-medium hover:text-[#00C2FF] hover:underline">
              Sign Up
            </Link>
          </p>
          
          <p className="text-center text-xs text-gray-400 mt-8">
            © 2026 TransitOps Inc. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;