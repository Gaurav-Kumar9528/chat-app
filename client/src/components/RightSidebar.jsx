import React, { useContext, useEffect, useState } from 'react'
import assets, { imagesDummyData } from '../assets/assets'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'

const RightSidebar = () => {

   const {selectedUser, messages} = useContext(ChatContext)
   const {logout, onlineUsers} = useContext(AuthContext)
   const [msgImages, setMsgImages] = useState([])

   // Get all the images form the messages and set them to state 
    useEffect(()=>{
        setMsgImages(
            messages.filter(msg => msg.image).map(msg=>msg.image)
        )
    }, [messages])

  return selectedUser && (
    <div className={`
      bg-[#8185B2]/10 
      text-white 
      w-full 
      h-full
      max-h-screen
      relative 
      overflow-y-auto 
      ${selectedUser ? "max-lg:hidden" : ""}
    `}>
      {/* Profile Section */}
      <div className='pt-6 sm:pt-8 lg:pt-12 flex flex-col items-center gap-3 sm:gap-4 px-4 sm:px-6'>
        <img 
          src={selectedUser?.profilePic || assets.avatar_icon} 
          alt={selectedUser.fullName} 
          className='w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full object-cover border-4 border-gray-600/50 shadow-lg' 
        />
        <div className='text-center'>
          <h1 className='text-lg sm:text-xl lg:text-2xl font-semibold flex items-center justify-center gap-2 mb-1'>
            {onlineUsers.includes(selectedUser._id) && (
              <span className='w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0 animate-pulse'></span>
            )}
            <span className='truncate max-w-[200px]'>{selectedUser.fullName}</span>
          </h1>
          <p className='text-xs sm:text-sm text-gray-300 mt-2 px-4 max-w-sm'>
            {selectedUser.bio || 'No bio available'}
          </p>
        </div>
      </div>

      <hr className='border-[#ffffff20] my-4 sm:my-6 mx-4'/>

      {/* Media Section */}
      <div className='px-4 sm:px-6 pb-24'>
        <p className='font-semibold text-sm sm:text-base mb-3 sm:mb-4'>Shared Media</p>
        {msgImages.length > 0 ? (
          <div className='grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3'>
            {msgImages.map((url, index)=>(
              <div 
                key={index} 
                onClick={()=> window.open(url, '_blank')} 
                className='cursor-pointer rounded-lg overflow-hidden hover:opacity-80 transition-opacity group'
              >
                <img 
                  src={url} 
                  alt={`Shared media ${index + 1}`} 
                  className='w-full h-full object-cover rounded-lg aspect-square group-hover:scale-105 transition-transform' 
                />
              </div>  
            ))}
          </div>
        ) : (
          <div className='text-center py-8 sm:py-12'>
            <p className='text-gray-400 text-sm'>No media shared yet</p>
          </div>
        )}
      </div>

      {/* Logout Button */}
      <div className='sticky bottom-0 left-0 right-0 p-4 sm:p-5 bg-[#8185B2]/10 backdrop-blur-md border-t border-stone-500/50'>
        <button 
          onClick={()=> logout()} 
          className='w-full bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none 
          text-sm sm:text-base font-medium py-3 sm:py-3.5 px-6 rounded-full cursor-pointer hover:opacity-90 
          transition-all active:scale-95 shadow-lg'
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default RightSidebar
