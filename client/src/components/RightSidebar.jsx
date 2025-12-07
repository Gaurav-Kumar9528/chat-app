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
      relative 
      overflow-y-auto overflow-x-hidden
      ${selectedUser ? "max-lg:hidden" : ""}
    `}>
      <div className='pt-8 sm:pt-12 lg:pt-16 flex flex-col items-center gap-2 sm:gap-3 text-xs sm:text-sm font-light px-4'>
        <img 
          src={selectedUser?.profilePic || assets.avatar_icon} 
          alt={selectedUser.fullName} 
          className='w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 aspect-[1/1] rounded-full object-cover border-2 border-gray-600/50'
        />
        <h1 className='px-4 sm:px-10 text-lg sm:text-xl font-medium mx-auto flex items-center gap-2'>
          {onlineUsers.includes(selectedUser._id) && (
            <span className='w-2 h-2 rounded-full bg-green-500 flex-shrink-0 animate-pulse'></span>
          )}
          <span className='truncate max-w-[180px] sm:max-w-[200px]'>{selectedUser.fullName}</span>
        </h1>
        <p className='px-4 sm:px-10 mx-auto text-center text-xs sm:text-sm'>{selectedUser.bio || 'No bio available'}</p>
      </div>

      <hr className='border-[#ffffff50] my-3 sm:my-4 mx-4'/>

      <div className='px-4 sm:px-5 text-xs sm:text-sm pb-20'>
        <p className='font-medium mb-2 sm:mb-3'>Media</p>
        {msgImages.length > 0 ? (
          <div className='mt-2 max-h-[200px] sm:max-h-[250px] overflow-y-auto grid grid-cols-2 gap-2 sm:gap-3 sm:gap-4 opacity-80'>
            {msgImages.map((url, index)=>(
              <div 
                key={index} 
                onClick={()=> window.open(url, '_blank')} 
                className='cursor-pointer rounded-lg overflow-hidden hover:opacity-100 transition-opacity aspect-square'
              >
                <img src={url} alt={`Media ${index + 1}`} className='w-full h-full object-cover rounded-md'/>
              </div>  
            ))}
          </div>
        ) : (
          <div className='text-center py-8 text-gray-400'>
            <p className='text-xs sm:text-sm'>No media shared yet</p>
          </div>
        )}
      </div>

      <div className='sticky bottom-0 left-0 right-0 p-4 bg-[#8185B2]/10 backdrop-blur-md border-t border-stone-500/50'>
        <button 
          onClick={()=> logout()} 
          className='w-full bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none 
          text-xs sm:text-sm font-medium py-2.5 sm:py-3 px-6 sm:px-8 lg:px-20 rounded-full cursor-pointer hover:opacity-90 active:scale-95 transition-all shadow-lg min-h-[44px]'
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default RightSidebar
