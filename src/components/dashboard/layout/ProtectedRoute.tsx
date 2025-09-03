// src/components/dashboard/layout/ProtectedRoute.tsx
"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[]; // e.g., ["OWNER"], ["USER"]
}

export function ProtectedRoutes({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.replace("/login");
      return;
    }
    if (!allowedRoles.includes(session.user?.role || "")) {
      // redirect to home or their dashboard if role doesn't match
      if (session.user?.role === "OWNER") router.replace("/owner");
      else if (session.user?.role === "USER" || session.user?.role === "PLAYER")
        router.replace("/player");
      else router.replace("/");
    }
  }, [session, status, router, allowedRoles]);

 if (!session || !allowedRoles.includes(session.user?.role || "")) return null;

  return <>{children}</>;
}
