import { AuthForm } from "@/components/custom/AuthForm/AuthForm";

export default function AuthPage() {
  return (
    <div className="w-full grid min-h-svh bg-background">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md bg-card rounded-3xl shadow-lg p-8 border-border">
            <AuthForm />
          </div>
        </div>
      </div>
    </div>
  )
}