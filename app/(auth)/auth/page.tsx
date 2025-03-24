import { AuthForm } from '@/components/custom/AuthForm'

export default function AuthPage() {
  return (
    <div className="w-full grid min-h-svh bg-gray-50">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-sm p-8">
            <AuthForm />
          </div>
        </div>
      </div>
    </div>
  )
}