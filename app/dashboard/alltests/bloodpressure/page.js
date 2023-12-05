"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <main className="h-screen w-screen py-8 px-4 ">
      <div>Hello</div>
    </main>
  );
}
