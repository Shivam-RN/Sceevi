// app/layout.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Navbar from "@/components/Navbar";
import { ReactNode } from "react";

const layout = async ({ children }: { children: ReactNode }) => {
  const rawHeaders = await headers(); 
  const incomingHeaders = new Headers(rawHeaders); 

  const session = await auth.api.getSession({
    headers: incomingHeaders,
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default layout;
