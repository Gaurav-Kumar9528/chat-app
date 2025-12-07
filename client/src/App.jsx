import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import {Toaster} from "react-hot-toast";
import { AuthContext } from '../context/AuthContext'
import assets from './assets/assets'

const App = () =>{
  const { authUser } = useContext(AuthContext)
  return (
    <div 
      className="min-h-screen h-screen w-full bg-cover bg-center bg-no-repeat bg-fixed" 
      style={{backgroundImage: `url(${assets.bgImage})`}}
    >
      <Toaster 
        position="top-center"
        containerStyle={{
          top: '1rem',
        }}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1f2937',
            color: '#fff',
            borderRadius: '0.75rem',
            padding: '1rem',
            fontSize: '0.875rem',
            maxWidth: '90vw',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />}/>
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />}/>
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to="/login" />}/>
      </Routes>
    </div>
  )
}

export default App