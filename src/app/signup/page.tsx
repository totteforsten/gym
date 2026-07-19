import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";

export const metadata = { title: "Skapa konto · Atlas" };
export const dynamic = "force-dynamic";

export default function SignupPage() {
  return (
    <Suspense>
      <AuthForm mode="signup" />
    </Suspense>
  );
}
