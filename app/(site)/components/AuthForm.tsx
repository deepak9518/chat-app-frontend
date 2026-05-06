"use client";

import Button from "@/app/components/Button";
import Input from "@/app/components/input/Input";
import { useState, useCallback } from "react";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import AuthSocialButton from "./AuthSocialButton";
import { BsGithub, BsGoogle, BsTwitter } from "react-icons/bs";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { api } from "@/app/lib/api";

type Variant = "LOGIN" | "REGISTER";

const AuthForm = () => {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [variant, setVariant] = useState<Variant>("LOGIN");
  const [isLoading, setIsLoading] = useState(false);

  const toggleVariant = useCallback(() => {
    setVariant((prev) => (prev === "LOGIN" ? "REGISTER" : "LOGIN"));
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    try {
      if (variant === "REGISTER") {
        await api.post("/auth/register", data);

        toast.success("Account created!");
      }

      if (variant === "LOGIN") {
        await api.post("/auth/login", data);

        toast.success("Logged in!");
      }

      await refreshUser();
      router.push("/conversations");
    } catch (err: any) {
      const errorCode = err?.response?.status;

      if (errorCode === 400) {
        toast.error("Invalid input!");
      } else if (errorCode === 401) {
        toast.error("Invalid credentials!");
      } else if (errorCode === 409) {
        toast.error("Email already exists!");
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {variant === "REGISTER" && (
            <Input
              id="name"
              label="Name"
              register={register}
              errors={errors}
              disabled={isLoading}
            />
          )}

          <Input
            id="email"
            type="email"
            label="Email Address"
            register={register}
            errors={errors}
            disabled={isLoading}
          />

          <Input
            id="password"
            type="password"
            label="Password"
            register={register}
            errors={errors}
            disabled={isLoading}
          />

          <Button disabled={isLoading} type="submit" fullWidth>
            {variant === "REGISTER" ? "Sign up" : "Sign in"}
          </Button>
        </form>

        <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
          <span>
            {variant === "REGISTER" ? "Already have an account?" : "New here?"}
          </span>
          <button
            type="button"
            onClick={toggleVariant}
            className="underline text-blue-500"
          >
            {variant === "REGISTER" ? "Sign in" : "Sign up"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default AuthForm;
