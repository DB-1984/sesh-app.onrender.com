import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-svh items-center justify-center app-bg p-6">
      <div className="flex flex-col items-center gap-6 w-full max-w-sm">
        <span className="text-4xl font-bold logo-text animate-bounce">
          Sesh
        </span>

        <div className="w-full bg-background p-6 shadow-lg rounded-lg">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}
