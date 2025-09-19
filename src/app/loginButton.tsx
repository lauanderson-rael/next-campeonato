"use client";
import Image from "next/image";
import { signIn } from "next-auth/react";
export default function LoginButton() {
  function Login() {
    signIn("google", { callbackUrl: "/dashboard" });
  }
  return (
    <button
      onClick={Login}
      className="flex gap items-center border border-neutral-900 p-2 rounded-md"
    >
      <Image src="/g-icon.png" alt="Google Logo" width={32} height={32} />
      Login com Google
    </button>
  );
}
