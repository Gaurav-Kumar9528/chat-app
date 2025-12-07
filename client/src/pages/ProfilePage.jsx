import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const ProfilePage = () => {
  
  const {authUser, updateProfile} = useContext(AuthContext);

  const [selectedImg, setSelectedImg] = useState(null)
  const navigate = useNavigate()
  const [name, setName] = useState(authUser.fullName)
  const [bio, setBio] = useState(authUser.bio)

  const handleSubmit = async (e)=>{
    e.preventDefault();
    if(!selectedImg){
      await updateProfile({fullName: name, bio});
      navigate('/');
      return;
    }

    // Check file size (max 5MB)
    if(selectedImg.size > 5 * 1024 * 1024){
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => {
      toast.error("Failed to read image file");
    };
    reader.readAsDataURL(selectedImg);
    reader.onload = async ()=>{
      try {
        const base64Image = reader.result;
        await updateProfile({profilePic: base64Image, fullName: name, bio});
        navigate('/');
      } catch (error) {
        toast.error("Failed to update profile");
      }
    }
   
  }


  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center 
    justify-center'>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 
      border-gray-600 flex items-center justify-between max-sm:flex-col-reverse
      rounded-lg'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5 p-10 flex-1'>
          <h3 className='text-lg'>Profile details</h3>
          <label htmlFor="avatar" className='flex items-center gap-3 
          cursor-pointer hover:opacity-80 transition-opacity'>
            <input onChange={(e)=>setSelectedImg(e.target.files[0])} type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden/>
            <img src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon} alt="Profile avatar" className={`w-12 h-12 rounded-full object-cover ${ selectedImg &&'ring-2 ring-violet-500'}`} onError={(e)=>{e.target.src = assets.avatar_icon}}/>
            upload profile image
          </label>
          <input onChange={(e)=>setName(e.target.value)} value={name}
          type="text" required placeholder='Your name' className='p-2 border 
          border-gray-500 rounded-md focus:outline-none focus:ring-2 
          focus:ring-violet-500' />
          <textarea onChange={(e)=>setBio(e.target.value)} value={bio} placeholder="Write profile bio" required className='p-2 border 
          border-gray-500 rounded-md focus:outline-none focus:ring-2 
          focus:ring-violet-500' rows={4}></textarea>

          <button type="submit" className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer hover:opacity-90 transition-opacity font-medium'>Save</button>
        </form>
        <img className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 object-cover`} src={authUser?.profilePic || assets.logo_icon} alt={authUser?.fullName || "Profile"} onError={(e)=>{e.target.src = assets.logo_icon}} />
      </div>
      
    </div>
  )
}

export default ProfilePage
