import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const ProfilePage = () => {
  
  const {authUser, updateProfile} = useContext(AuthContext);

  const [selectedImg, setSelectedImg] = useState(null)
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if(authUser){
      setName(authUser.fullName || '')
      setBio(authUser.bio || '')
    }
  }, [authUser])

  const handleSubmit = async (e)=>{
    e.preventDefault();
    
    if(!name.trim()){
      toast.error("Name is required")
      return;
    }
    
    if(!bio.trim()){
      toast.error("Bio is required")
      return;
    }
    
    setIsLoading(true);
    
    try {
      if(!selectedImg){
        await updateProfile({fullName: name.trim(), bio: bio.trim()});
        navigate('/');
      } else {
        // Check file size (max 5MB)
        if(selectedImg.size > 5 * 1024 * 1024){
          toast.error("Image size should be less than 5MB")
          setIsLoading(false);
          return;
        }
        
        const reader = new FileReader();
        reader.readAsDataURL(selectedImg);
        reader.onload = async ()=>{
          try {
            const base64Image = reader.result;
            await updateProfile({profilePic: base64Image, fullName: name.trim(), bio: bio.trim()});
            navigate('/');
          } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile")
            setIsLoading(false);
          }
        }
        reader.onerror = () => {
          toast.error("Error reading image file")
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile")
      setIsLoading(false);
    }
  }


  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center 
    justify-center p-4 sm:p-6 md:p-8'>
      <div className='w-full max-w-2xl backdrop-blur-2xl text-gray-300 border-2 
      border-gray-600 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8
      rounded-lg p-4 sm:p-6 md:p-8'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4 sm:gap-5 p-4 sm:p-6 md:p-10 flex-1 w-full'>
          <h3 className='text-base sm:text-lg font-medium'>Profile details</h3>
          <label htmlFor="avatar" className='flex items-center gap-3 
          cursor-pointer hover:opacity-80 transition-opacity'>
            <input onChange={(e)=>setSelectedImg(e.target.files[0])} type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden/>
            <img src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon} alt="Profile" className={`w-10 h-10 sm:w-12 sm:h-12 ${ selectedImg &&'rounded-full'}`}/>
            <span className='text-sm sm:text-base'>upload profile image</span>
          </label>
          <input onChange={(e)=>setName(e.target.value)} value={name}
          type="text" required placeholder='Your name' className='p-2.5 sm:p-3 border 
          border-gray-500 rounded-md focus:outline-none focus:ring-2 
          focus:ring-violet-500 bg-white/5 text-white placeholder-gray-400' />
          <textarea onChange={(e)=>setBio(e.target.value)} value={bio} placeholder="Write profile bio" required className='p-2.5 sm:p-3 border 
          border-gray-500 rounded-md focus:outline-none focus:ring-2 
          focus:ring-violet-500 bg-white/5 text-white placeholder-gray-400 resize-none' rows={4}></textarea>

          <button type="submit" disabled={isLoading} className='bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2.5 sm:p-3 rounded-full text-sm sm:text-base md:text-lg cursor-pointer hover:opacity-90 transition-opacity font-medium disabled:opacity-50 disabled:cursor-not-allowed'>
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </form>
        <img className={`w-32 h-32 sm:w-40 sm:h-40 md:max-w-44 aspect-square rounded-full mx-auto sm:mx-0 sm:flex-shrink-0
        ${ selectedImg &&'rounded-full'}`} src={authUser?.profilePic || assets.logo_icon} alt="Profile" />
      </div>
      
    </div>
  )
}

export default ProfilePage
