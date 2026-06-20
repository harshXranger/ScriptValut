import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import AuthLayout from '../layouts/AuthLayout'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const { signup, loginAsGuest } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    try {
      signup(form)
      toast.success('Account created — welcome to ScriptVault!')
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGuest = () => {
    loginAsGuest()
    toast.success('Continuing as guest')
    navigate('/dashboard')
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Free, local-first, and ready in seconds."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-amber-accent">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Jane Doe"
        />
        <Input
          label="Email"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="you@example.com"
        />
        <Input
          label="Password"
          type="password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="At least 6 characters"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" disabled={loading} className="mt-1 w-full">
          {loading ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-ink-100 dark:bg-ink-800" />
        <span className="text-xs text-ink-400">or</span>
        <div className="h-px flex-1 bg-ink-100 dark:bg-ink-800" />
      </div>
      <Button onClick={handleGuest} variant="secondary" className="w-full">
        Continue as guest
      </Button>
    </AuthLayout>
  )
}
