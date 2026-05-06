import { AuthForm } from '@/components/auth/AuthForm'

export default function TechnicianLoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <AuthForm role="technician" />
    </div>
  )
}
