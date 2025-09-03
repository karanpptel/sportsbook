"use client";

import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Sidebar } from "./Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const loading = status === "loading";

    useEffect(() => {
        if (!loading && !session) {
            router.replace("/login");
        }
    }, [loading, session, router]);

    if (loading) return <div>Loading...</div>;
    if (!session) return null;

  const role = session.user?.role === "OWNER" ? "OWNER" : "USER";

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role={role} />
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}
