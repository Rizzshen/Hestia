import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "../../store/authStore";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import AuthLayout from "../../components/layout/AuthLayout";
import { Mail, Lock, User, Briefcase } from "lucide-react";

// Zod schema with password confirmation
const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    role: z.enum(["admin", "finance", "business"], {
      errorMap: () => ({ message: "Please select a role" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuthStore();

  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "business", // Default role
    },
  });

  const onSubmit = async (data) => {
    setApiError("");
    setIsSubmitting(true);

    try {
      const user = await registerUser(
        data.name,
        data.email,
        data.password,
        data.role,
      );

      // Redirect based on role (same as login)
      if (user.role === "admin") navigate("/admin-dashboard");
      else if (user.role === "finance") navigate("/finance-dashboard");
      else if (user.role === "business") navigate("/business-dashboard");
      else navigate("/dashboard");
    } catch (err) {
      setApiError(err.response?.data?.error || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Create Account" subtitle="Join the Hestia platform">
      {apiError && (
        <div className="bg-danger-bg text-danger p-3 rounded-md mb-6 text-sm text-center border border-danger-border/30">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Field */}
        <Input
          type="text"
          icon={User}
          placeholder="Full name"
          error={errors.name?.message}
          {...register("name")}
        />

        {/* Email Field */}
        <Input
          type="email"
          icon={Mail}
          placeholder="Email address"
          error={errors.email?.message}
          {...register("email")}
        />

        {/* Role Dropdown */}
        <div>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted pointer-events-none" />
            <select
              {...register("role")}
              className={`w-full rounded-md border p-2.5 pl-10 text-sm bg-surface-secondary/40 text-text shadow-sm focus:outline-none focus:ring-2 transition-all appearance-none cursor-pointer ${
                errors.role
                  ? "border-danger focus:border-danger focus:ring-danger/20"
                  : "border-border focus:border-primary focus:ring-primary/20"
              }`}
            >
              <option value="admin">Admin</option>
              <option value="finance">Finance</option>
              <option value="business">Business</option>
            </select>
            {/* Custom dropdown arrow */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                className="h-4 w-4 text-text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
          {errors.role && (
            <p className="mt-1.5 text-xs text-danger">{errors.role.message}</p>
          )}
        </div>

        {/* Password Field */}
        <Input
          type="password"
          icon={Lock}
          placeholder="Password"
          error={errors.password?.message}
          {...register("password")}
        />

        {/* Confirm Password Field */}
        <Input
          type="password"
          icon={Lock}
          placeholder="Confirm password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full mt-6 py-2.5"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      {/* Login Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-text-secondary">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-primary hover:text-primary-hover font-medium underline underline-offset-2 transition-colors"
          >
            Login here
          </button>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;
