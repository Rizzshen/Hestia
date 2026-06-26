import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "../../store/authStore";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import AuthLayout from "../../components/layout/AuthLayout";
import { Mail, Lock } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setApiError("");
    setIsSubmitting(true);

    try {
      const user = await login(data.email, data.password);

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
    <AuthLayout title="Welcome Back" subtitle="Sign in to your Hestia account">
      {apiError && (
        <div className="bg-danger-bg text-danger p-3 rounded-md mb-6 text-sm text-center border border-danger-border/30">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          type="email"
          icon={Mail}
          placeholder="Email address"
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          type="password"
          icon={Lock}
          placeholder="Password"
          error={errors.password?.message}
          {...register("password")}
        />

        <Button
          type="submit"
          className="w-full mt-6 py-2.5"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </form>

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
    </AuthLayout>
  );
};

export default Login;
