'use client'
import { FormEvent, useState } from 'react'
import { config } from '../config'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'

type AuthMode = 'signin' | 'signup'

export default function SignIn() {
  const [mode, setMode] = useState<AuthMode>('signin')
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()

  const resetForm = () => {
    setName('')
    setUsername('')
    setPassword('')
    setConfirmPassword('')
  }

  const redirectByLevel = (level: string) => {
    if (level === 'admin') {
      router.push('/backoffice/dashboard')
    } else {
      router.push('/backoffice/sell')
    }
  }

  const signInWithCredentials = async (usernameValue: string, passwordValue: string) => {
    const response = await axios.post(`${config.apiUrl}/user/signin`, {
      username: usernameValue,
      password: passwordValue,
    })

    if (response.data.token !== null) {
      localStorage.setItem('token', response.data.token)
      redirectByLevel(response.data.level)
      return
    }

    throw new Error('Invalid username or password')
  }

  const handleSignIn = async () => {
    if (!username.trim() || !password.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing information',
        text: 'Please enter username and password.',
        timer: 2000,
      })
      return
    }

    await signInWithCredentials(username.trim(), password)
  }

  const handleSignUp = async () => {
    const trimmedName = name.trim()
    const trimmedUsername = username.trim()

    if (!trimmedName || !trimmedUsername || !password || !confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing information',
        text: 'Please complete all signup fields.',
        timer: 2000,
      })
      return
    }

    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Password mismatch',
        text: 'Please confirm your password again.',
        timer: 2000,
      })
      return
    }

    await axios.post(`${config.apiUrl}/user/create`, {
      name: trimmedName,
      username: trimmedUsername,
      password,
      level: 'user',
    })

    Swal.fire({
      icon: 'success',
      title: 'Account created',
      text: 'Signing you in now.',
      timer: 1400,
      showConfirmButton: false,
    })

    await signInWithCredentials(trimmedUsername, password)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      if (mode === 'signin') {
        await handleSignIn()
      } else {
        await handleSignUp()
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        Swal.fire({
          icon: 'warning',
          title: 'Sign In Failed',
          text: 'Invalid username or password',
          timer: 2000,
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: mode === 'signin' ? 'Sign In Error' : 'Sign Up Error',
          text: axios.isAxiosError(error)
            ? error.response?.data?.message ?? error.response?.data?.error ?? error.message
            : error instanceof Error
              ? error.message
              : 'An error occurred. Please try again later.',
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode)
    resetForm()
  }

  return (
    <div className='signin-container'>
      <form className="signin-box" onSubmit={handleSubmit}>
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-700 text-xl text-white shadow-lg shadow-teal-900/20">
            <i className="fa fa-mobile-screen-button"></i>
          </div>
          <div>
            <h1>Mobileshop</h1>
            <p className="text-sm text-slate-500">
              {mode === 'signin' ? 'Sign in to continue' : 'Create your staff account'}
            </p>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-2 rounded-md bg-slate-100 p-1">
          <button
            type="button"
            className={`signin-tab ${mode === 'signin' ? 'signin-tab-active' : ''}`}
            onClick={() => switchMode('signin')}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`signin-tab ${mode === 'signup' ? 'signin-tab-active' : ''}`}
            onClick={() => switchMode('signup')}
          >
            Sign Up
          </button>
        </div>

        {mode === 'signup' && (
          <>
            <div>Name</div>
            <input
              type='text'
              placeholder='Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete='name'
            />
          </>
        )}

        <div className={mode === 'signup' ? 'mt-4' : ''}>Username</div>
        <input
          type='text'
          placeholder='Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete='username'
        />

        <div className='mt-4'>Password</div>
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
        />

        {mode === 'signup' && (
          <>
            <div className='mt-4'>Confirm Password</div>
            <input
              type='password'
              placeholder='Confirm password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete='new-password'
            />
          </>
        )}

        <button className='mt-4' type='submit' disabled={isSubmitting}>
          <span>{isSubmitting ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}</span>
          <i className={mode === 'signin' ? 'fa fa-sign-in-alt' : 'fa fa-user-plus'}></i>
        </button>
      </form>
    </div>
  );
}
