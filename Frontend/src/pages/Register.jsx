import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Truck } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import axiosInstance from "../api/axiosInstance";
import { ROLES } from "../utils/constants";

const registerSchema = z
  .object({
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    role: z.enum([
      ROLES.FLEET_MANAGER,
      ROLES.SAFETY_OFFICER,
      ROLES.FINANCIAL_ANALYST,
      ROLES.DRIVER,
    ]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

function Register() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: ROLES.FLEET_MANAGER },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Omit confirmPassword before sending to API
      const { confirmPassword, ...registerData } = data;
      const res = await axiosInstance.post("/auth/register", registerData);
      const { user, token } = res.data;

      login(user, token);
      toast.success(`Account created successfully! Welcome, ${user.email.split('@')[0]}`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0F172A] font-sans">
      {/* Left Side - Visual/Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-bl from-brand-900 via-brand-700 to-brand-500 text-white relative overflow-hidden flex-col justify-center items-center p-12">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[#121821]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-brand-500/50 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 text-center animate-fade-in-up">
          <div className="bg-[#121821]/20 p-4 rounded-2xl inline-block mb-6 backdrop-blur-sm border border-white/30">
            <Truck size={48} className="text-white" />
          </div>
          <h1 className="text-5xl font-bold font-heading mb-4 tracking-tight">Join TransitOps</h1>
          <p className="text-xl text-brand-100 max-w-md font-light leading-relaxed">
            Create an account to streamline your logistics and transport operations.
          </p>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 animate-fade-in">
        <div className="w-full max-w-md glass-panel p-8 sm:p-10 rounded-3xl mt-4 mb-4">
          <div className="text-center mb-8">
            <div className="lg:hidden bg-[#00C2FF]/10 p-3 rounded-2xl inline-block mb-4 text-[#00C2FF]">
              <Truck size={32} />
            </div>
            <h2 className="text-3xl font-bold font-heading text-white mb-2">Create Account</h2>
            <p className="text-[#9CA3AF]">Sign up to get started</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              <label className="block text-sm font-medium text-[#E5E7EB] mb-1.5 ml-1">Role</label>
              <select
                {...register("role")}
                className="w-full bg-[#121821] border border-[#1F2937] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all duration-200 appearance-none"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23E5E7EB\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
              >
                {Object.values(ROLES).map((r) => (
                  <option className="bg-[#0B0F14] text-[#E5E7EB]"  key={r} value={r}>{r}</option>
                ))}
              </select>
              {errors.role && (
                <p className="text-red-500 text-xs mt-1.5 ml-1 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-red-500"></span>
                  {errors.role.message}
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

            <div>
              <label className="block text-sm font-medium text-[#E5E7EB] mb-1.5 ml-1">Confirm Password</label>
              <input
                type="password"
                {...register("confirmPassword")}
                className="w-full bg-[#121821] border border-[#1F2937] rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all duration-200"
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1.5 ml-1 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-red-500"></span>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00C2FF] text-black hover:shadow-cyan-500/50 hover:shadow-lg transition-all duration-300 py-3.5 rounded-xl font-medium hover:bg-[#00A8E0] focus:outline-none focus:ring-4 focus:ring-brand-500/30 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 mt-4 shadow-lg shadow-brand-500/25"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </div>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-[#9CA3AF] mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-[#00C2FF] font-medium hover:text-[#00C2FF] hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
