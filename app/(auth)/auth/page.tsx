import { AuthForm } from '@/components/custom/AuthForm'

export default function AuthPage() {
  return (
    <div className="w-full grid min-h-svh grid-cols-1 min-[1336px]:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10 col-span-full min-[1336px]:col-span-1">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <AuthForm />
          </div>
        </div>
      </div>
      <div className="relative hidden min-[1336px]:flex items-center justify-center">
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold text-center transition-all duration-300">
          Eventify
        </h1>
      </div>
    </div>
  )
}
