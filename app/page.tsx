'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, ArrowRight, ArrowUpRight } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

export default function LoginPage() {
  const router = useRouter()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('admin@nexuscrm.io')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e?: { preventDefault?: () => void }) => {
    e?.preventDefault?.()
    setLoading(true)
    setError('')

    try {
      await signIn(email, password)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to sign in')
      setLoading(false)
    }
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-[#fafafa]">
      {/* LEFT — PRODUCT PANEL */}
      <div
        className="hidden lg:flex lg:w-[58%] relative flex-col px-16 py-16 overflow-hidden"
        style={{
          background:
            'radial-gradient(1400px 700px at -10% -10%, rgba(148,163,184,0.05) 0%, transparent 60%),' +
            'radial-gradient(1000px 600px at 110% 110%, rgba(100,116,139,0.04) 0%, transparent 60%),' +
            'linear-gradient(180deg, #0a0b0e 0%, #0b0d11 100%)',
        }}
      >
        {/* ultra-subtle grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.014) 1px, transparent 1px),' +
              'linear-gradient(to bottom, rgba(255,255,255,0.014) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 55%, #000 30%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 55%, #000 30%, transparent 100%)',
          }}
        />

        {/* LOGO */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-[7px] bg-white/95 flex items-center justify-center">
            <div
              className="w-3.5 h-3.5 rounded-[3px]"
              style={{ background: 'linear-gradient(135deg, #334155, #0f172a)' }}
            />
          </div>
          <span className="text-white/95 font-semibold text-[15px] tracking-tight">Nexus</span>
        </div>

        {/* CENTER — headline + metric cards */}
        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-[560px]">
          <div
            className="inline-flex self-start items-center gap-2 px-2.5 py-1 rounded-full text-[10.5px] font-medium tracking-wide mb-14"
            style={{
              background: 'rgba(255,255,255,0.018)',
              color: '#94a3b8',
              border: '1px solid rgba(255,255,255,0.04)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/70" />
            All systems operational
          </div>

          <h1 className="text-[54px] leading-[1.02] font-semibold tracking-[-0.025em] text-white/95">
            Run your pipeline<br />
            <span style={{ color: '#3f4a5c' }}>with precision.</span>
          </h1>

          <p className="text-[14px] leading-relaxed mt-10 max-w-[380px]" style={{ color: '#64748b' }}>
            The CRM for operators who measure everything.
          </p>

          {/* ambient metric cards */}
          <div className="mt-28 grid grid-cols-3 gap-2.5 max-w-[500px]">
            <MetricCard label="Pipeline" value="$284k" delta="+12.4%" />
            <MetricCard label="Win rate" value="38%" delta="+4.1%" />
            <MetricCard label="Cycle" value="11d" delta="−2.3d" trend="down" />
          </div>
        </div>

        {/* bottom meta */}
        <div className="relative z-10 flex items-center justify-between text-[11.5px]" style={{ color: '#2a3344' }}>
          <span className="tracking-wide">© 2026 Nexus Labs</span>
          <div className="flex items-center gap-3">
            <a className="hover:text-slate-400 transition-colors duration-200" href="#">Privacy</a>
            <a className="hover:text-slate-400 transition-colors duration-200" href="#">Terms</a>
            <span className="w-px h-3 bg-slate-800/60" />
            <span>SOC 2 · ISO 27001</span>
          </div>
        </div>
      </div>

      {/* RIGHT — FORM */}
      <div className="flex-1 flex items-center justify-center px-6 relative">
        {/* mobile brand */}
        <div className="lg:hidden absolute top-6 left-6 flex items-center gap-2">
          <div className="w-7 h-7 rounded-[7px] flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #334155, #0f172a)' }}>
            <div className="w-3.5 h-3.5 rounded-[3px] bg-white" />
          </div>
          <span className="font-semibold text-slate-900 tracking-tight text-[15px]">Nexus</span>
        </div>

        <div className="w-full max-w-[340px]">
          <div className="mb-12">
            <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-slate-900">
              Sign in to your workspace
            </h2>
            <p className="text-[13px] text-slate-500 mt-4 leading-relaxed">
              Enter your credentials to continue.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <Field
              label="Email"
              id="email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@company.com"
              disabled={loading}
            />

            <Field
              label="Password"
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              disabled={loading}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 transition-colors duration-200"
                  aria-label="Toggle password"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              labelRight={
                <button
                  type="button"
                  className="text-[11.5px] text-slate-400 hover:text-slate-700 transition-colors duration-200"
                >
                  Forgot password
                </button>
              }
            />

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-[6px] text-red-600 text-[12px]">
                {error}
              </div>
            )}

            <label className="flex items-center gap-2 pt-1 cursor-pointer select-none">
              <input
                type="checkbox"
                defaultChecked
                className="w-[14px] h-[14px] rounded-[4px] accent-slate-900 cursor-pointer"
              />
              <span className="text-[12px] text-slate-600">Keep me signed in</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full h-[46px] mt-4 rounded-[8px] text-[13px] font-medium text-white overflow-hidden transition-all duration-300 ease-out disabled:opacity-80 hover:-translate-y-[1px] active:translate-y-0"
              style={{
                background: 'linear-gradient(180deg, #1f2430 0%, #0d1117 100%)',
                boxShadow:
                  '0 1px 0 0 rgba(255,255,255,0.04) inset,' +
                  '0 0 0 1px rgba(13,17,23,0.9),' +
                  '0 1px 2px rgba(13,17,23,0.12)',
              }}
            >
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: 'linear-gradient(180deg, #262c3a 0%, #12171f 100%)' }}
              />
              <span className="relative z-10 flex items-center justify-center gap-1.5">
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/25 border-t-white rounded-full animate-spin" />
                    Signing in
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </>
                )}
              </span>
            </button>
          </form>

          <div className="my-8 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200/60" />
            <span className="text-[10px] font-medium tracking-[0.14em] text-slate-400 uppercase">or</span>
            <div className="flex-1 h-px bg-slate-200/60" />
          </div>

          <button
            onClick={() => handleLogin()}
            className="group w-full h-[46px] rounded-[8px] text-[13px] font-medium border border-slate-200/70 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/50 transition-all duration-300 flex items-center justify-center gap-1.5"
          >
            Continue with demo workspace
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 transition-transform duration-300 group-hover:-translate-y-px group-hover:translate-x-px" />
          </button>

          <p className="mt-12 text-center text-[12px] text-slate-400">
            New to Nexus?{' '}
            <a href="#" className="text-slate-700 hover:text-slate-900 font-medium transition-colors duration-200">
              Request access
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  id,
  type,
  value,
  onChange,
  placeholder,
  rightSlot,
  labelRight,
  disabled,
}: {
  label: string
  id: string
  type: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rightSlot?: React.ReactNode
  labelRight?: React.ReactNode
  disabled?: boolean
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-[12px] font-medium tracking-wide text-slate-600">
          {label}
        </label>
        {labelRight}
      </div>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full h-[46px] px-4 pr-10 text-[13.5px] rounded-[8px] bg-slate-50/60 text-slate-900 placeholder:text-slate-400 border border-slate-200/70 focus:outline-none focus:bg-white focus:border-slate-300 focus:ring-[3px] focus:ring-slate-900/[0.03] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {rightSlot && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightSlot}</div>
        )}
      </div>
    </div>
  )
}

function MetricCard({
  label,
  value,
  delta,
}: {
  label: string
  value: string
  delta: string
  trend?: 'up' | 'down'
}) {
  return (
    <div
      className="px-3.5 py-3.5 rounded-[10px]"
      style={{
        background: 'rgba(255,255,255,0.008)',
        border: '1px solid rgba(255,255,255,0.028)',
      }}
    >
      <div className="text-[10px] font-medium tracking-[0.08em] uppercase" style={{ color: '#3f4a5c' }}>
        {label}
      </div>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="text-[17px] font-medium tracking-tight tabular-nums" style={{ color: '#cbd5e1' }}>
          {value}
        </span>
        <span className="text-[10.5px] font-medium tabular-nums" style={{ color: '#475569' }}>
          {delta}
        </span>
      </div>
    </div>
  )
}
