'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import WorkoutApp from '@/components/WorkoutApp'

export default function Page() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [mode, setMode] = useState('login') // 'login' | 'signup'

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSubmit = async () => {
    setError('')
    const fn = mode === 'login'
      ? supabase.auth.signInWithPassword({ email, password })
      : supabase.auth.signUp({ email, password })
    const { error: e } = await fn
    if (e) setError(e.message)
  }

  if (loading) return <div style={{ background: '#111111', minHeight: '100vh' }} />
  if (user) return <WorkoutApp user={user} onSignOut={() => supabase.auth.signOut()} />

  return (
    <div style={{ background: '#0f0b08', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Jost',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Jost:wght@300;400;500;600&family=Outfit:wght@400;700&display=swap" rel="stylesheet" />
      <div style={{ width: '100%', maxWidth: 360, padding: 24, boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🌳</div>
          <div style={{ fontSize: 32, fontFamily: "'Playfair Display',serif", fontWeight: 700, background: 'linear-gradient(135deg,#c8854a,#e8b87a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Nico's Plan
          </div>
          <div style={{ fontSize: 12, color: '#a08060', letterSpacing: 3, textTransform: 'uppercase', marginTop: 4 }}>2026 Training Regime</div>
        </div>

        <div style={{ background: '#1c1510', borderRadius: 16, padding: 24, border: '1px solid #3a2d1f' }}>
          <input
            type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', boxSizing: 'border-box', background: '#241c14', border: '1px solid #3a2d1f', borderRadius: 10, color: '#f5ede3', fontFamily: 'inherit', fontSize: 14, padding: '12px 14px', marginBottom: 12, outline: 'none' }}
          />
          <input
            type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={{ width: '100%', boxSizing: 'border-box', background: '#241c14', border: '1px solid #3a2d1f', borderRadius: 10, color: '#f5ede3', fontFamily: 'inherit', fontSize: 14, padding: '12px 14px', marginBottom: error ? 12 : 20, outline: 'none' }}
          />
          {error && <div style={{ fontSize: 12, color: '#e05a5a', marginBottom: 12 }}>{error}</div>}
          <button onClick={handleSubmit}
            style={{ width: '100%', background: 'linear-gradient(135deg,#c8854a,#e8b87a88)', border: '1px solid #c8854a', borderRadius: 10, color: '#000', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 700, padding: '13px 16px', marginBottom: 12 }}>
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
          <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            style={{ width: '100%', background: 'none', border: 'none', color: '#a08060', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}>
            {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  )
}