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
    <div className='min-h-screen bg-cover bg-center flex items-center 
    justify-center gap-4 sm:gap-6 md:gap-8 px-4 sm:px-6 md:px-8 py-6 sm:py-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>

      {/* -------- left -------- */}
      <img src={assets.logo_big} alt="Logo" className='w-[min(25vw, 200px)] sm:w-[min(30vw, 250px)] max-sm:w-32 sm:max-sm:w-40'/>

      {/* -------- right -------- */}

      <form onSubmit={onSumbitHandler} className='border-2 bg-white/8 text-white border-gray-500 p-4 sm:p-5 md:p-6 flex 
      flex-col gap-4 sm:gap-5 md:gap-6 rounded-lg shadow-lg w-full max-w-md'>
        <h2 className='font-medium text-xl sm:text-2xl flex justify-between items-center'>
          {currState}
          {isDataSubmitted && <img onClick={()=> setIsDataSubmitted(false)} src={assets.arrow_icon} alt="Back" className='w-5 
          cursor-pointer hover:opacity-70 transition-opacity'/>}
          
          </h2>

          {currState === "Sign up" && !isDataSubmitted && (
            <input onChange={(e)=>setFullName(e.target.value)} value={fullName}
            type="text" className='p-2.5 sm:p-3 border border-gray-500 rounded-md 
            focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white/5 text-white placeholder-gray-400' placeholder='Full Name' required/>
          )}

          {!isDataSubmitted && (
            <>
            <input onChange={(e)=>setEmail(e.target.value)} value={email}
            type="email" placeholder='Email Address' required className='p-2.5 sm:p-3 
            border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white/5 text-white placeholder-gray-400'/>
            <input onChange={(e)=>setPassword(e.target.value)} value={password}
            type="password" placeholder='Password' required className='p-2.5 sm:p-3 
            border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white/5 text-white placeholder-gray-400'/>
            </>
          )}

          {currState === "Sign up" && isDataSubmitted && (
              <textarea onChange={(e)=>setBio(e.target.value)} value={bio}
              rows={4} className='p-2.5 sm:p-3 border border-gray-500 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white/5 text-white placeholder-gray-400 resize-none' 
              placeholder='provide a short bio...' required></textarea>
           )
          }

          <button type='submit' className='py-2.5 sm:py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer hover:opacity-90 transition-opacity text-sm sm:text-base font-medium'>
            {currState === "Sign up" ? "Create Account" : "Login Now"}
          </button>

          <div className='flex items-start gap-2 text-xs sm:text-sm text-gray-400'>
            <input type="checkbox" className='mt-0.5 cursor-pointer' />
            <p>Agree to the terms of use & privacy policy.</p>
          </div>

          <div className='flex flex-col gap-2'>
            {currState === "Sign up" ? (
              <p className='text-xs sm:text-sm text-gray-400'>Already have an account? <span 
              onClick={()=>{setCurrState("Login"); setIsDataSubmitted(false)}}
              className='font-medium text-violet-400 cursor-pointer hover:text-violet-300 transition-colors'>Login here</span></p>
            ) : (
              <p className='text-xs sm:text-sm text-gray-400'>Create an account <span 
              onClick={()=> setCurrState("Sign up")}
              className='font-medium text-violet-400 cursor-pointer hover:text-violet-300 transition-colors'>Click here</span></p>
            )}
          </div>

      </form>
    </div>
  )
}

export default LoginPage
