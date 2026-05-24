import { useState } from 'react'
import { signIn, signUp, confirmSignUp, resendSignUpCode } from 'aws-amplify/auth'

export default function AuthPage({ onSignIn }) {
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [pendingEmail, setPendingEmail] = useState('')

  async function handleSignIn() {
    if (!email || !password) { setError('Please fill in all fields'); return }
    setLoading(true); setError('')
    try {
      await signIn({ username: email, password })
      onSignIn()
    } catch (err) { setError(err.message || 'Sign in failed') }
    setLoading(false)
  }

  async function handleSignUp() {
    if (!email || !password || !confirmPassword) { setError('Please fill in all fields'); return }
    if (password !== confirmPassword) { setError('Passwords do not match'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true); setError('')
    try {
      await signUp({ username: email, password, options: { userAttributes: { email } } })
      setPendingEmail(email)
      setMode('verify')
    } catch (err) { setError(err.message || 'Sign up failed') }
    setLoading(false)
  }

  async function handleVerify() {
    if (!code) { setError('Please enter the verification code'); return }
    setLoading(true); setError('')
    try {
      await confirmSignUp({ username: pendingEmail, confirmationCode: code })
      setMode('signin')
      setEmail(pendingEmail)
      setError('')
    } catch (err) { setError(err.message || 'Verification failed') }
    setLoading(false)
  }

  async function handleResendCode() {
    try {
      await resendSignUpCode({ username: pendingEmail })
      setError('Code resent! Check your email.')
    } catch (err) { setError(err.message || 'Failed to resend code') }
  }

  const fieldStyle = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1px solid #1a2f55',
    fontSize: '15px',
    color: '#ffffff',
    background: '#071029',
    marginBottom: '16px',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box'
  }

  const labelStyle = {
    fontSize: '11px',
    fontWeight: '700',
    color: '#1de9b6',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    marginBottom: '6px',
    display: 'block'
  }

  const btnStyle = {
    width: '100%',
    padding: '16px',
    borderRadius: '14px',
    border: 'none',
    background: '#1de9b6',
    color: '#0a0f1e',
    fontSize: '16px',
    fontWeight: '800',
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.7 : 1,
    fontFamily: 'inherit',
    marginTop: '4px'
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0f1e',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>

      {/* Background circles */}
      <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '350px', height: '350px', borderRadius: '50%', background: '#1a2744' }}/>
      <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '280px', height: '280px', borderRadius: '50%', background: '#0d1b35' }}/>

      {/* Background dots */}
      {[
        { top: '15%', left: '10%', opacity: 0.4 },
        { top: '30%', left: '20%', opacity: 0.2 },
        { top: '60%', right: '15%', opacity: 0.4 },
        { top: '75%', right: '25%', opacity: 0.25 },
        { top: '20%', right: '30%', opacity: 0.3 },
        { top: '45%', left: '5%', opacity: 0.2 },
      ].map((dot, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: '6px', height: '6px',
          borderRadius: '50%',
          background: '#1de9b6',
          opacity: dot.opacity,
          top: dot.top,
          left: dot.left,
          right: dot.right
        }}/>
      ))}

      {/* Background lines */}
      <div style={{ position: 'absolute', top: '25%', left: '5%', height: '1px', width: '200px', background: 'linear-gradient(90deg, transparent, #1de9b6, transparent)', opacity: 0.15, transform: 'rotate(-15deg)' }}/>
      <div style={{ position: 'absolute', bottom: '30%', right: '5%', height: '1px', width: '200px', background: 'linear-gradient(90deg, transparent, #1de9b6, transparent)', opacity: 0.15, transform: 'rotate(10deg)' }}/>

      {/* Floating tags */}
      <div style={{ position: 'absolute', top: '60px', left: '10px', background: '#0d1b35', border: '1px solid #1a2f55', borderRadius: '12px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '700', color: '#8aa4cc', zIndex: 3 }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1de9b6' }}/>
        2,400+ goals tracked
      </div>
      <div style={{ position: 'absolute', bottom: '80px', right: '10px', background: '#0d1b35', border: '1px solid #1a2f55', borderRadius: '12px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '700', color: '#8aa4cc', zIndex: 3 }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff6b9d' }}/>
        Join 500+ dreamers
      </div>

      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '420px' }}>

        {/* Top badge */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(29,233,182,0.12)', border: '1px solid rgba(29,233,182,0.3)', color: '#1de9b6', fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', padding: '6px 16px', borderRadius: '30px', marginBottom: '10px' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#1de9b6' }}/>
            🪣 Bucket List Tracker
          </div>
          <p style={{ fontSize: '13px', color: '#2a4070' }}>Track every dream. Live every moment.</p>
        </div>

        {/* Card */}
        <div style={{ background: '#0d1b35', borderRadius: '24px', padding: '40px', border: '1px solid #1a2f55' }}>

          {/* Icon */}
          <div style={{ width: '70px', height: '70px', borderRadius: '50%', border: '2px solid #1de9b6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '30px', background: 'rgba(29,233,182,0.08)' }}>
            🪣
          </div>

          {/* Verify mode */}
          {mode === 'verify' ? (
            <>
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', textAlign: 'center', margin: '0 0 6px' }}>
                Check your email!
              </h2>
              <p style={{ fontSize: '14px', color: '#4a6fa5', textAlign: 'center', margin: '0 0 28px' }}>
                We sent a code to{' '}
                <strong style={{ color: '#1de9b6' }}>{pendingEmail}</strong>
              </p>

              <label style={labelStyle}>Verification Code</label>
              <input
                style={fieldStyle}
                type="text"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={e => setCode(e.target.value)}
                maxLength={6}
              />

              {error && (
                <p style={{ color: error.includes('resent') ? '#1de9b6' : '#ff6b9d', fontSize: '13px', marginBottom: '12px', textAlign: 'center' }}>
                  {error}
                </p>
              )}

              <button style={btnStyle} onClick={handleVerify} disabled={loading}>
                {loading ? 'Verifying...' : 'Verify Email →'}
              </button>

              <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: '#4a6fa5' }}>
                Didn't get it?{' '}
                <span style={{ color: '#ff6b9d', fontWeight: '700', cursor: 'pointer' }} onClick={handleResendCode}>
                  Resend code
                </span>
              </p>
            </>
          ) : (
            <>
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', textAlign: 'center', margin: '0 0 6px' }}>
                {mode === 'signin' ? 'Welcome back' : 'Create account'}
              </h2>
              <p style={{ fontSize: '14px', color: '#4a6fa5', textAlign: 'center', margin: '0 0 24px' }}>
                {mode === 'signin' ? "Continue your life's adventure" : 'Start tracking your dreams today'}
              </p>

              {/* Tabs */}
              <div style={{ display: 'flex', background: '#071029', borderRadius: '12px', padding: '4px', marginBottom: '24px', border: '1px solid #1a2f55' }}>
                <div
                  onClick={() => { setMode('signin'); setError('') }}
                  style={{ flex: 1, textAlign: 'center', padding: '10px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', background: mode === 'signin' ? '#1de9b6' : 'transparent', color: mode === 'signin' ? '#0a0f1e' : '#4a6fa5', transition: 'all 0.2s' }}
                >
                  Sign In
                </div>
                <div
                  onClick={() => { setMode('signup'); setError('') }}
                  style={{ flex: 1, textAlign: 'center', padding: '10px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', background: mode === 'signup' ? '#1de9b6' : 'transparent', color: mode === 'signup' ? '#0a0f1e' : '#4a6fa5', transition: 'all 0.2s' }}
                >
                  Create Account
                </div>
              </div>

              {/* Fields */}
              <label style={labelStyle}>Email address</label>
              <input style={fieldStyle} type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />

              <label style={labelStyle}>Password</label>
              <input style={fieldStyle} type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />

              {mode === 'signup' && (
                <>
                  <label style={labelStyle}>Confirm Password</label>
                  <input style={fieldStyle} type="password" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                </>
              )}

              {mode === 'signin' && (
                <div style={{ textAlign: 'right', marginTop: '-10px', marginBottom: '20px' }}>
                  <span style={{ fontSize: '13px', color: '#ff6b9d', fontWeight: '600', cursor: 'pointer' }}>
                    Forgot password?
                  </span>
                </div>
              )}

              {error && (
                <p style={{ color: '#ff6b9d', fontSize: '13px', marginBottom: '12px', textAlign: 'center', background: 'rgba(255,107,157,0.1)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,107,157,0.2)' }}>
                  ⚠️ {error}
                </p>
              )}

              <button
                style={btnStyle}
                onClick={mode === 'signin' ? handleSignIn : handleSignUp}
                disabled={loading}
              >
                {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In →' : 'Create Account →'}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
                <div style={{ flex: 1, height: '1px', background: '#1a2f55' }}/>
                <div style={{ fontSize: '11px', color: '#2a4070', fontWeight: '700', letterSpacing: '1px' }}>OR CONTINUE WITH</div>
                <div style={{ flex: 1, height: '1px', background: '#1a2f55' }}/>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #1a2f55', background: '#071029', fontSize: '13px', fontWeight: '700', color: '#8aa4cc', cursor: 'pointer', textAlign: 'center' }}>
                  🔵 Google
                </div>
                <div style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #1a2f55', background: '#071029', fontSize: '13px', fontWeight: '700', color: '#8aa4cc', cursor: 'pointer', textAlign: 'center' }}>
                  ⚫ Apple
                </div>
              </div>

              <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#4a6fa5' }}>
                {mode === 'signin' ? 'New here? ' : 'Already have an account? '}
                <span
                  style={{ color: '#ff6b9d', fontWeight: '700', cursor: 'pointer' }}
                  onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError('') }}
                >
                  {mode === 'signin' ? 'Create account free →' : 'Sign in →'}
                </span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}