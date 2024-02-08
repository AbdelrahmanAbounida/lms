import { auth } from "@/auth";
import { redirect } from "next/navigation";

interface AuthLayoutProps {
  children: React.ReactNode;
}
export default async function DashboardLayout({ children }: AuthLayoutProps) {
  const session = await auth();
  const isStudent = session?.user.role == "STUDENT";

  if (isStudent) {
    return redirect("/not-allowed");
  }

  return <div className="h-full">{children}</div>;
}
