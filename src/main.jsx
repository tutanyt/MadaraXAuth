import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { createClient } from '@supabase/supabase-js'
import { Shield, Eye, EyeOff, ArrowUpRight, Zap, LockKeyhole, Fingerprint, LogOut, UserRound, Mail, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react'
import './style.css'

const url = import.meta.env.VITE_SUPABASE_URL
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = url && anon && !url.includes('YOUR_PROJECT') ? createClient(url, anon) : null

function App() {
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState(null)
  const [session, setSession] = useState(null)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, current) => setSession(current))
    return () => subscription.unsubscribe()
  }, [])

  async function submit(e) {
    e.preventDefault()
    setNotice(null)
    if (!supabase) {
      setNotice({ type: 'error', text: 'Authentication is not configured yet. Add your Supabase URL and publishable/anon key in Netlify environment variables.' })
      return
    }
    if (!email.trim() || !password) {
      setNotice({ type: 'error', text: 'Enter your email and password to continue.' })
      return
    }
    setBusy(true)
    try {
      const result = mode === 'signup'
        ? await supabase.auth.signUp({ email: email.trim(), password, options: { emailRedirectTo: window.location.origin } })
        : await supabase.auth.signInWithPassword({ email: email.trim(), password })
      if (result.error) throw result.error
      if (mode === 'signup' && !result.data.session) {
        setNotice({ type: 'success', text: 'Account created. Check your email to confirm your address, then sign in.' })
      } else {
        setNotice({ type: 'success', text: mode === 'signup' ? 'Account created successfully.' : 'Signed in successfully.' })
      }
    } catch (err) {
      setNotice({ type: 'error', text: err.message || 'Authentication failed. Please try again.' })
    } finally { setBusy(false) }
  }

  async function signOut() {
    if (supabase) await supabase.auth.signOut()
    setNotice({ type: 'success', text: 'You have been signed out.' })
  }

  return <main className="shell">
    <div className="ambient ambient-one"/><div className="ambient ambient-two"/>
    <header className="topbar">
      <a className="brand" href="#" aria-label="MadaraXAuth home"><span className="brand-mark"><Shield size={21}/></span><span>Madara<span className="red">X</span>Auth</span></a>
      <div className="top-right"><span className="status-dot"/><span>AUTH SYSTEM <b>ONLINE DESIGN</b></span><span className="version">V1.0</span></div>
    </header>
    <section className="hero">
      <div className="hero-copy">
        <div className="eyebrow"><span className="eyebrow-line"/> PRIVATE ACCESS PORTAL</div>
        <h1>YOUR ACCESS.<br/><span>YOUR RULES.</span></h1>
        <p className="lead">A secure gateway to your digital world.<br className="desktop-break"/> Sign in to continue to the MadaraXAuth ecosystem.</p>
        <div className="feature-row">
          <div className="feature"><span><LockKeyhole size={17}/></span><div><b>Secure access</b><small>Protected sessions</small></div></div>
          <div className="feature"><span><Fingerprint size={17}/></span><div><b>Identity first</b><small>Account-based login</small></div></div>
        </div>
        <div className="quote"><div className="quote-bar"/><div><p>“Power is not will. It is the phenomenon of physically making things happen.”</p><small>— MADARA INSPIRED · MXA</small></div></div>
      </div>
      <div className="login-wrap">
        <div className="login-card">
          <div className="card-top"><div className="card-icon"><Shield size={23}/></div><div className="secure-label"><span className="status-dot"/> SECURE CONNECTION</div></div>
          {session ? <>
            <div className="welcome-icon"><CheckCircle2 size={28}/></div>
            <div className="card-heading"><h2>You're in.</h2><p>Your account session is active.</p></div>
            <div className="user-panel"><UserRound size={18}/><div><small>SIGNED IN AS</small><b>{session.user.email}</b></div></div>
            <button className="submit-btn" onClick={signOut}>Sign out <LogOut size={17}/></button>
          </> : <>
            <div className="card-heading"><h2>{mode === 'signin' ? 'Welcome back' : 'Create account'}<span>.</span></h2><p>{mode === 'signin' ? 'Enter your credentials to access your account.' : 'Create your MadaraXAuth account to get started.'}</p></div>
            <div className="tabs"><button className={mode === 'signin' ? 'active' : ''} onClick={() => {setMode('signin');setNotice(null)}}>SIGN IN</button><button className={mode === 'signup' ? 'active' : ''} onClick={() => {setMode('signup');setNotice(null)}}>SIGN UP</button></div>
            <form onSubmit={submit}>
              <label htmlFor="email">EMAIL ADDRESS</label>
              <div className="input-wrap"><Mail size={17}/><input id="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} required/></div>
              <label htmlFor="password">PASSWORD</label>
              <div className="input-wrap"><KeyRound size={17}/><input id="password" type={showPassword?'text':'password'} autoComplete={mode==='signin'?'current-password':'new-password'} placeholder="Enter your password" minLength={6} value={password} onChange={e=>setPassword(e.target.value)} required/><button type="button" className="eye" aria-label={showPassword?'Hide password':'Show password'} onClick={()=>setShowPassword(!showPassword)}>{showPassword?<EyeOff size={17}/>:<Eye size={17}/>}</button></div>
              {mode === 'signup' && <p className="hint">Use at least 6 characters. A longer unique password is recommended.</p>}
              <button className="submit-btn" disabled={busy}>{busy ? 'Please wait…' : mode === 'signin' ? 'Sign in securely' : 'Create account'} {!busy && <ArrowUpRight size={18}/>}</button>
            </form>
            {notice && <div className={'notice '+notice.type}>{notice.type==='error'?<AlertCircle size={17}/>:<CheckCircle2 size={17}/>}<span>{notice.text}</span></div>}
            <div className="terms">By continuing, you agree to use this service responsibly.</div>
          </>}
        </div>
        <div className="card-foot"><span><Zap size={13}/> POWERED BY MXA</span><span>ENCRYPTED IN TRANSIT · HTTPS</span></div>
      </div>
    </section>
    <footer><span>© {new Date().getFullYear()} MADARAXAUTH</span><span>BUILT FOR YOUR WORKFLOW <i>◆</i></span><span className="footer-right">ACCESS IS A PRIVILEGE.</span></footer>
  </main>
}
createRoot(document.getElementById('root')).render(<App />)
