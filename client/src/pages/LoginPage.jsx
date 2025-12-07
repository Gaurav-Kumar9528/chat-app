import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const LoginPage = () => {

  const [currState, setCurrState] = useState("Sign up")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const {login} = useContext(AuthContext)

  const onSumbitHandler = async (event)=>{
    event.preventDefault();

    if(currState === 'Sign up' && !isDataSubmitted){
      if(!fullName.trim() || !email.trim() || !password.trim()){
        toast.error("Please fill all required fields")
        return;
      }
      setIsDataSubmitted(true)
      return;
    }
    
    if(currState === 'Sign up' && isDataSubmitted){
      if(!bio.trim()){
        toast.error("Please provide a bio")
        return;
      }
    }
    
    if(currState === 'Login'){
      if(!email.trim() || !password.trim()){
        toast.error("Please fill all fields")
        return;
      }
    }
     
    await login(currState=== "Sign up" ? 'signup' : 'login', {fullName, email, password, bio})
  }

  return (
    <div className='min-h-screen bg-cover bg-center bg-no-repeat flex items-center 
    justify-center gap-6 sm:gap-8 lg:gap-12 px-4 sm:px-6 md:px-8 py-8 sm:py-12 
    sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      
      {/* Logo Section */}
      <div className='flex-shrink-0 max-sm:w-full max-sm:flex max-sm:justify-center'>
        <img 
          src={assets.logo_big} 
          alt="Logo" 
          className='w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56' 
        />
      </div>

      {/* Form Section */}
      <form 
        onSubmit={onSumbitHandler} 
        className='border-2 bg-white/10 backdrop-blur-md text-white border-gray-500/50 
        p-5 sm:p-6 md:p-8 flex flex-col gap-5 sm:gap-6 rounded-xl sm:rounded-2xl shadow-2xl 
        w-full max-w-md'
      >
        <div className='flex justify-between items-center mb-2'>
          <h2 className='font-semibold text-2xl sm:text-3xl'>{currState}</h2>
          {isDataSubmitted && (
            <button 
              type="button"
              onClick={()=> setIsDataSubmitted(false)} 
              className='w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors'
            >
              <img src={assets.arrow_icon} alt="Back" className='w-5 h-5'/>
            </button>
          )}
        </div>

        {currState === "Sign up" && !isDataSubmitted && (
          <input 
            onChange={(e)=>setFullName(e.target.value)} 
            value={fullName}
            type="text" 
            className='p-3 sm:p-3.5 border border-gray-500/50 rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent 
            bg-white/5 text-white placeholder-gray-400 transition-all' 
            placeholder='Full Name' 
            required
          />
        )}

        {!isDataSubmitted && (
          <>
            <input 
              onChange={(e)=>setEmail(e.target.value)} 
              value={email}
              type="email" 
              placeholder='Email Address' 
              required 
              className='p-3 sm:p-3.5 border border-gray-500/50 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent 
              bg-white/5 text-white placeholder-gray-400 transition-all' 
            />
            <input 
              onChange={(e)=>setPassword(e.target.value)} 
              value={password}
              type="password" 
              placeholder='Password' 
              required 
              className='p-3 sm:p-3.5 border border-gray-500/50 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent 
              bg-white/5 text-white placeholder-gray-400 transition-all' 
            />
          </>
        )}

        {currState === "Sign up" && isDataSubmitted && (
          <textarea 
            onChange={(e)=>setBio(e.target.value)} 
            value={bio}
            rows={4} 
            className='p-3 sm:p-3.5 border border-gray-500/50 rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent 
            bg-white/5 text-white placeholder-gray-400 resize-none transition-all' 
            placeholder='Provide a short bio...' 
            required
          />
        )}

        <button 
          type='submit' 
          className='py-3 sm:py-3.5 bg-gradient-to-r from-purple-400 to-violet-600 text-white 
          rounded-lg cursor-pointer hover:opacity-90 active:scale-98 transition-all 
          text-base sm:text-lg font-semibold shadow-lg mt-2'
        >
          {currState === "Sign up" ? "Create Account" : "Login Now"}
        </button>

        <div className='flex items-start gap-2 text-xs sm:text-sm text-gray-300'>
          <input 
            type="checkbox" 
            className='mt-1 cursor-pointer accent-violet-500' 
            required
          />
          <p>I agree to the terms of use & privacy policy.</p>
        </div>

        <div className='text-center pt-2'>
          {currState === "Sign up" ? (
            <p className='text-xs sm:text-sm text-gray-300'>
              Already have an account?{' '}
              <span 
                onClick={()=>{setCurrState("Login"); setIsDataSubmitted(false)}}
                className='font-semibold text-violet-400 cursor-pointer hover:text-violet-300 transition-colors'
              >
                Login here
              </span>
            </p>
          ) : (
            <p className='text-xs sm:text-sm text-gray-300'>
              Don't have an account?{' '}
              <span 
                onClick={()=> setCurrState("Sign up")}
                className='font-semibold text-violet-400 cursor-pointer hover:text-violet-300 transition-colors'
              >
                Sign up here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  )
}

export default LoginPage
