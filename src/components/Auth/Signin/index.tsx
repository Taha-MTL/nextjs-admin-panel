"use client";
import React, { useState } from "react";
import Link from "next/link";
import GoogleSigninButton from "../GoogleSigninButton";
import SigninWithPassword from "../SigninWithPassword";
import Loader from "@/components/Loader/Subtle";

interface SignInFormData {
  email: string;
  password: string;
  rememberMe: boolean;
  showPassword: boolean;
}

export default function Signin() {
  const [loading, setLoading] = useState<boolean>(false);
  const [signinFormData, setSigninFormData] = useState<SignInFormData>({
    email: "",
    password: "",
    rememberMe: false,
    showPassword: false,
  });

  return loading ? (
    <Loader />
  ) : (
    <div className="space-y-6">
      <GoogleSigninButton text="Sign in with Google" setLoading={setLoading}/>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300 dark:border-gray-600"></span>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            Or continue with
          </span>
        </div>
      </div>

      <SigninWithPassword
        setLoading={setLoading}
        setFormData={setSigninFormData}
        formData={signinFormData}
      />

      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        Don’t have an account?{" "}
        <Link
          href="/auth/signup"
          className="font-medium text-primary hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
