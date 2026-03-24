import { LoginForm } from "@/components/LoginForm";
import { Link } from "react-router-dom";
import { SignupForm } from "@/components/SignupForm";

export default function LoginRegisterPage({ mode = "login" }) {
  // Use a mode prop to determine which form to show with a nested component - passed from the Route in main.tsx

  // Because we use a combined LoginRegisterPage for both /login and /register routes
  // and import a login and signup form component separately, we can conditionally render
  // the appropriate form based on the mode prop, which is passed the path from the Route
  const FormComponent = mode === "login" ? LoginForm : SignupForm;

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        {/* Desktop logo (lg and up only) */}
        <div className="hidden lg:flex justify-center md:justify-start">
          <a href="/" className="flex items-center font-medium">
            <span className="text-4xl font-bold logo-text text-foreground">
              Sesh
            </span>
          </a>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            {/* Mobile logo (below lg only) */}
            <span className="block lg:hidden text-3xl font-bold logo-text animate-bounce">
              Sesh
            </span>

            <div className="w-full max-w-xs bg-background p-4 shadow-lg rounded-lg">
              <FormComponent />
              <Link to="/forgot-password" className="no-underline">
                <p className="text-center pb-4 hover:underline text-sm text-muted-foreground">
                  Forgotten password?
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel (desktop only) */}
      <div className="relative hidden lg:flex items-center justify-center bg-zinc-900 p-8">
        <span className="logo-text-large text-4xl font-bold animate-bounce text-foreground">
          Sesh
        </span>
      </div>
    </div>
  );
}
