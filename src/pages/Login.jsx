import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import AuthLayout from '../layouts/AuthLayout'
import { Input } from '../components/ui/index.jsx'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, loginAsGuest } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault(); setError(''); setLoading(true)
    try { login(form); toast.success('Welcome back!'); navigate('/dashboard') }
    catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to keep writing."
      footer={<>New? <Link to="/signup" className="font-medium text-amber-accent">Create an account</Link></>}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Email" type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@example.com"/>
        <Input label="Password" type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••"/>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full">{loading ? 'Logging in…' : 'Log in'}</Button>
      </form>
      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-ink-100 dark:bg-ink-800"/> <span className="text-xs text-ink-400">or</span> <div className="h-px flex-1 bg-ink-100 dark:bg-ink-800"/>
      </div>
      <Button variant="secondary" className="w-full" onClick={() => { loginAsGuest(); toast.success('Guest mode'); navigate('/dashboard') }}>
        Continue as guest
      </Button>
    </AuthLayout>
  )
}
