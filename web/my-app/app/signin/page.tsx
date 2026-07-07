'use client'
import { useState } from 'react'
import { config } from '../config'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'

export default function SignIn() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const router = useRouter()

  const handleSignIn = async () => {
    try {
      const payload = {
        username: username,
        password: password
      }
      const response = await axios.post(`${config.apiUrl}/user/signin`, payload)
      if (response.data.token !== null) {
        localStorage.setItem('token', response.data.token)
        
        if(response.data.level === "admin"){
          router.push('/backoffice/dashboard')
        } else {
          router.push('/backoffice/sell')
        }
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Sign In Failed',
          text: 'Invalid username or password',
          timer: 2000
        })
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        Swal.fire({
          icon: 'warning',
          title: 'Sign In Failed',
          text: 'Invalid username or password',
          timer: 2000
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Sign In Error',
          text: axios.isAxiosError(error)
            ? error.response?.data?.message ?? error.message
            : 'An error occurred during sign in. Please try again later.',
        })
      }
    }
  }


  return (
    <div className='signin-container'>
      <div className="signin-box">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-700 text-xl text-white shadow-lg shadow-teal-900/20">
            <i className="fa fa-mobile-screen-button"></i>
          </div>
          <div>
            <h1>Mobileshop</h1>
            <p className="text-sm text-slate-500">Sign in to continue</p>
          </div>
        </div>
        <div>Username</div>
        <input
          type='text'
          placeholder='Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div className='mt-4'>Password</div>
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className='mt-4' onClick={handleSignIn}>
          <span>Sign In</span>
          <i className='fa fa-sign-in-alt'></i>
        </button>
      </div>
    </div>
  );
}
