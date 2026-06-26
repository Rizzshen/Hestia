import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "../../store/authStore";
import Button from "../../components/ui/Button";
import hestiaLogo from "../../assets/hestia.png";
import { Mail, Lock } from "lucide-react";

// 1. Zod Validation Schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. React Hook Form Setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // 3. Form Submission Handler
  const onSubmit = async (data) => {
    setApiError("");
    setIsSubmitting(true);

    try {
      const user = await login(data.email, data.password);

      // --- ROLE-BASED REDIRECT LOGIC ---
      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else if (user.role === "finance") {
        navigate("/finance-dashboard");
      } else if (user.role === "business") {
        navigate("/business-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        "An unexpected error occurred. Please try again.";
      setApiError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // Perfect dark gradient background
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] p-4">
      {/* Logo in Top Left */}
      <div className="absolute top-6 left-6">
        <img
          src={hestiaLogo}
          alt="Hestia"
          className="h-10 w-auto object-contain"
        />
      </div>

      <div className="w-full max-w-md">
        {/* Glassmorphism Card with Everything Inside */}
        <div className="bg-white/95 backdrop-blur-md rounded-lg shadow-2xl border border-white/20 p-8">
          {/* Header Inside Card */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-text">Welcome Back</h1>
            <p className="text-sm text-text-secondary mt-1">
              Sign in to your Hestia account
            </p>
          </div>

          {/* Global API Error Message */}
          {apiError && (
            <div className="bg-danger-bg text-danger p-3 rounded-md mb-6 text-sm text-center border border-danger-border/30">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field with Icon */}
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                <input
                  type="email"
                  {...register("email")}
                  className={`w-full rounded-md border p-2.5 pl-10 text-sm bg-surface-secondary/40 text-text shadow-sm focus:outline-none focus:ring-2 transition-all placeholder:text-text-muted ${
                    errors.email
                      ? "border-danger focus:border-danger focus:ring-danger/20"
                      : "border-border focus:border-primary focus:ring-primary/20"
                  }`}
                  placeholder="Email address"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-danger">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field with Icon */}
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                <input
                  type="password"
                  {...register("password")}
                  className={`w-full rounded-md border p-2.5 pl-10 text-sm bg-surface-secondary text-text shadow-sm focus:outline-none focus:ring-2 transition-all placeholder:text-text-muted ${
                    errors.password
                      ? "border-danger focus:border-danger focus:ring-danger/20"
                      : "border-border focus:border-primary focus:ring-primary/20"
                  }`}
                  placeholder="Password"
                />
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-danger">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full mt-6 py-2.5"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-text-secondary">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-primary hover:text-primary-hover font-medium underline underline-offset-2 transition-colors"
              >
                Register here
              </button>
            </p>
          </div>
        </div>

        {/* Footer text */}
        <p className="text-center text-xs text-slate-500 mt-8">
          &copy; {new Date().getFullYear()} Hestia. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
