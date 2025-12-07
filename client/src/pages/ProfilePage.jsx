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
    justify-center p-4 sm:p-6 md:p-8 lg:p-12'>
      <div className='w-full max-w-4xl backdrop-blur-2xl text-gray-300 border-2 
      border-gray-600/50 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-12
      rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 lg:p-10 shadow-2xl'>
        
        {/* Form Section */}
        <form 
          onSubmit={handleSubmit} 
          className='flex flex-col gap-5 sm:gap-6 flex-1 w-full order-2 lg:order-1'
        >
          <h3 className='text-xl sm:text-2xl font-semibold mb-2'>Profile Details</h3>
          
          <label 
            htmlFor="avatar" 
            className='flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity p-3 rounded-lg hover:bg-white/5'
          >
            <input 
              onChange={(e)=>setSelectedImg(e.target.files[0])} 
              type="file" 
              id='avatar' 
              accept='.png, .jpg, .jpeg, .webp' 
              hidden
            />
            <img 
              src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon} 
              alt="Profile" 
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-gray-600/50 ${selectedImg ? 'ring-2 ring-violet-500' : ''}`}
            />
            <span className='text-sm sm:text-base font-medium'>Upload profile image</span>
          </label>
          
          <input 
            onChange={(e)=>setName(e.target.value)} 
            value={name}
            type="text" 
            required 
            placeholder='Your name' 
            className='p-3 sm:p-3.5 border border-gray-500/50 rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent 
            bg-white/5 text-white placeholder-gray-400 transition-all' 
          />
          
          <textarea 
            onChange={(e)=>setBio(e.target.value)} 
            value={bio} 
            placeholder="Write profile bio" 
            required 
            className='p-3 sm:p-3.5 border border-gray-500/50 rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent 
            bg-white/5 text-white placeholder-gray-400 resize-none transition-all' 
            rows={4}
          />

          <button 
            type="submit" 
            disabled={isLoading} 
            className='bg-gradient-to-r from-purple-400 to-violet-600 text-white 
            py-3 sm:py-3.5 rounded-lg text-base sm:text-lg font-semibold 
            cursor-pointer hover:opacity-90 active:scale-98 transition-all 
            disabled:opacity-50 disabled:cursor-not-allowed shadow-lg mt-2'
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
        
        {/* Profile Image Preview */}
        <div className='flex-shrink-0 order-1 lg:order-2'>
          <img 
            className='w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 
            aspect-square rounded-full object-cover border-4 border-gray-600/50 shadow-2xl' 
            src={selectedImg ? URL.createObjectURL(selectedImg) : (authUser?.profilePic || assets.logo_icon)} 
            alt="Profile Preview" 
          />
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
