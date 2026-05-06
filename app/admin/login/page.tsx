import { AuthForm } from '@/components/auth/AuthForm'

export default function AdminLoginPage() {
  return (
    <div className="w-full min-h-screen">
      <AuthForm role="admin" />
    </div>
  )
}
