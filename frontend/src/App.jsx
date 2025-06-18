import {Routes, Route, Navigate} from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import HomePage from './pages/HomePage.jsx'
import Settings from './pages/Settings.jsx'
import Signup from './pages/Signup.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import Login from './pages/LoginPage.jsx'
import { axiosInstance } from './lib/axios.js'
import { useAuthStore } from './store/useAuthStore.js'
import { useThemeStore } from './store/useThemeStore.js'
import React from 'react'
import {useEffect} from 'react'
import {Loader} from 'lucide-react'
import toast from 'react-hot-toast'
import { Toaster } from 'react-hot-toast'
const App = () => {
  const {authUser, checkAuth, isCheckingAuth} = useAuthStore();
  const {theme} = useThemeStore();

  useEffect(() => {
    checkAuth()
  }, [checkAuth]);

  console.log("isCheckingAuth: ", isCheckingAuth);
  console.log("authUser: ", authUser);

  if(isCheckingAuth && !authUser) return (
    <div className='flex items-center justify-center h-screen'> 
      <Loader className='size-10 animate-spin'/>
    </div>
  )
  return (
    <div data-theme={theme}>
      <Toaster position='top-center' reverseOrder={true}/>
      <Navbar />
      <Routes>
        <Route path='/' element = {authUser? <HomePage /> : <Navigate to='/login' />} />
        <Route path='/settings' element = {<Settings />} />
        <Route path='/signup' element = {!authUser ? <Signup /> : <Navigate to='/' />} />
        <Route path='/login' element = {!authUser ? <Login /> : <Navigate to='/' />} />
        <Route path='/profile' element = {authUser? <ProfilePage /> : <Navigate to='/login' />} />
      </Routes>

      
    </div>

    
  )
}

export default App
