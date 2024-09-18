import React from "react";
import Image from "next/image";
import { Metadata } from "next";
import Signin from "@/components/Auth/Signin";

export const metadata: Metadata = {
  title: "Sign In | NextAdmin Dashboard",
  description: "Sign in to your NextAdmin Dashboard account",
};

const SignIn: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-gray-800">
        <div className="flex flex-col md:flex-row">
          <div className="w-full p-8 md:w-1/2 md:p-12">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Please sign in to your account
              </p>
            </div>
            <Signin />
          </div>

          <div className="to-primary-light hidden bg-gradient-to-br from-primary md:flex md:w-1/2 md:flex-col md:items-center md:justify-center md:p-12">
            <div className="text-center">
              <div className="mb-8 inline-block">
                <Image
                  src="/images/logo/logo.svg"
                  alt="Logo"
                  width={176}
                  height={32}
                  className="dark:hidden"
                />
                <Image
                  src="/images/logo/logo-dark.svg"
                  alt="Logo"
                  width={176}
                  height={32}
                  className="hidden dark:block"
                />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-white">
                Start your journey with us
              </h3>
              <p className="mb-8 text-lg text-white text-opacity-80">
                Discover the power of our dashboard and take control of your
                data
              </p>
            </div>
            <div className="relative mt-8 w-full max-w-md">
              <div className="absolute inset-0 rounded-lg bg-white bg-opacity-10 backdrop-blur-md"></div>
              <Image
                src="/images/grids/grid-02.svg"
                alt="Grid"
                width={400}
                height={300}
                className="relative z-10 mx-auto opacity-70"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
