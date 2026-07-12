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
    email: z.string().email("Enter a valid email").optional().or(z.literal("")),
    phone: z.string().optional().or(z.literal("")),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    role: z.enum([
      ROLES.FLEET_MANAGER,
      ROLES.SAFETY_OFFICER,
      ROLES.FINANCIAL_ANALYST,
      ROLES.DRIVER,
    ]),
  })
  .superRefine((data, ctx) => {
    if (data.role === ROLES.DRIVER) {
      if (!data.phone || data.phone.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Phone number is required for drivers",
          path: ["phone"],
        });
      }
    } else {
      if (!data.email || data.email.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Email is required",
          path: ["email"],
        });
      }
    }
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords don't match",
        path: ["confirmPassword"],
      });
    }
  });

function Register() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: ROLES.FLEET_MANAGER },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { confirmPassword, ...registerData } = data;
      // If email is empty string, make it undefined so backend sparse index works
      if (!registerData.email) delete registerData.email;
      if (!registerData.phone) delete registerData.phone;

      const res = await axiosInstance.post("/auth/register", registerData);
      const { user, token } = res.data;

      login(user, token);
      const displayName = user.email ? user.email.split('@')[0] : 'Driver';
      toast.success(`Account created successfully! Welcome, ${displayName}`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F14] font-sans p-4">
      <div className="flex w-full max-w-5xl bg-[#121821] rounded-3xl shadow-2xl overflow-hidden border border-[#1F2937]">
        
        {/* Left Side - Image Background */}
        <div className="hidden lg:block lg:w-1/2 relative bg-[#0F172A]">
          <img src="/auth-bg.png" alt="Logistics Transport" className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] via-transparent to-transparent opacity-80" />
          
          <div className="absolute top-8 left-8 flex items-center gap-2">
            <div className="bg-[#00C2FF] p-2 rounded-xl shadow-[0_0_15px_rgba(0,194,255,0.4)]">
              <Truck size={24} className="text-black" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">TransitOps</h1>
          </div>
          <div className="absolute bottom-12 left-10">
            <h2 className="text-4xl font-bold text-white leading-tight mb-2">Modern Fleet<br/>Management</h2>
            <p className="text-[#9CA3AF]">Intelligent routing, tracking, and insights.</p>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center animate-fade-in bg-[#121821]">
          <div className="w-full max-w-md mx-auto">
            <div className="lg:hidden flex items-center gap-2 mb-8">
              <div className="bg-[#00C2FF] p-2 rounded-xl shadow-[0_0_15px_rgba(0,194,255,0.4)]">
                <Truck size={24} className="text-black" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">TransitOps</h1>
            </div>

            <h2 className="text-3xl font-bold text-white mb-2">Create an account</h2>
            <p className="text-[#9CA3AF] mb-8">
              Already have an account?{" "}
              <Link to="/login" className="text-[#00C2FF] hover:underline">Log in</Link>
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#E5E7EB] mb-1.5 ml-1">Role</label>
                <select
                  {...register("role")}
                  className="w-full bg-[#0B0F14] border border-[#1F2937] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00C2FF]/50 focus:border-[#00C2FF] transition-all duration-200 appearance-none"
                  style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23E5E7EB\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
                >
                  {Object.values(ROLES).map((r) => (
                    <option className="bg-[#0B0F14] text-[#E5E7EB]" key={r} value={r}>{r}</option>
                  ))}
                </select>
                {errors.role && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.role.message}</p>}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-[#E5E7EB] mb-1.5 ml-1">
                    Email Address {selectedRole !== ROLES.DRIVER && <span className="text-red-500">*</span>}
                    {selectedRole === ROLES.DRIVER && <span className="text-gray-500 font-normal ml-1">(Optional)</span>}
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full bg-[#0B0F14] border border-[#1F2937] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00C2FF]/50 focus:border-[#00C2FF] transition-all duration-200"
                    placeholder="you@company.com"
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.email.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#E5E7EB] mb-1.5 ml-1">
                  Phone Number {selectedRole === ROLES.DRIVER && <span className="text-red-500">*</span>}
                  {selectedRole !== ROLES.DRIVER && <span className="text-gray-500 font-normal ml-1">(Optional)</span>}
                </label>
                <input
                  type="text"
                  {...register("phone")}
                  className="w-full bg-[#0B0F14] border border-[#1F2937] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00C2FF]/50 focus:border-[#00C2FF] transition-all duration-200"
                  placeholder="+1 (555) 000-0000"
                />
                {errors.phone && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.phone.message}</p>}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-[#E5E7EB] mb-1.5 ml-1">Password</label>
                  <input
                    type="password"
                    {...register("password")}
                    className="w-full bg-[#0B0F14] border border-[#1F2937] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00C2FF]/50 focus:border-[#00C2FF] transition-all duration-200"
                    placeholder="••••••••"
                  />
                  {errors.password && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.password.message}</p>}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-[#E5E7EB] mb-1.5 ml-1">Confirm Password</label>
                  <input
                    type="password"
                    {...register("confirmPassword")}
                    className="w-full bg-[#0B0F14] border border-[#1F2937] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00C2FF]/50 focus:border-[#00C2FF] transition-all duration-200"
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.confirmPassword.message}</p>}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-all duration-300 py-3.5 rounded-xl font-medium focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/30 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-6 shadow-lg shadow-[#7C3AED]/25"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Register;
