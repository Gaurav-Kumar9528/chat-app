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
    <div className={`bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll ${selectedUser ? "max-lg:hidden" : ""}`}>

        <div className='pt-8 sm:pt-12 lg:pt-16 flex flex-col items-center gap-2 text-xs sm:text-sm font-light mx-auto px-4'>
            <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-16 sm:w-20 aspect-[1/1] rounded-full'/>
            <h1 className='px-4 sm:px-10 text-lg sm:text-xl font-medium mx-auto flex items-center gap-2'>
              {onlineUsers.includes(selectedUser._id) &&  <span className='w-2 h-2 rounded-full bg-green-500 flex-shrink-0'></span>}
              <span className='truncate'>{selectedUser.fullName}</span>
            </h1>
            <p className='px-4 sm:px-10 mx-auto text-center text-xs sm:text-sm'>{selectedUser.bio}</p>
        </div>

        <hr className='border-[#ffffff50] my-3 sm:my-4'/>

        <div className='px-4 sm:px-5 text-xs sm:text-sm pb-20'>
            <p className='font-medium mb-2'>Media</p>
            <div className='mt-2 max-h-[200px] sm:max-h-[250px] overflow-y-scroll grid grid-cols-2 gap-2 sm:gap-4 opacity-80'>
                {msgImages.length > 0 ? (
                    msgImages.map((url, index)=>(
                        <div key={index} onClick={()=> window.open(url)} className='cursor-pointer rounded overflow-hidden hover:opacity-100 transition-opacity'>
                            <img src={url} alt="" className='w-full h-full object-cover rounded-md aspect-square'/>
                        </div>  
                    ))
                ) : (
                    <p className='text-gray-400 text-xs col-span-2 text-center py-4'>No media shared yet</p>
                )}
            </div>
        </div>

        <button onClick={()=> logout()} className='sticky bottom-4 sm:bottom-5 left-1/2 transform -translate-x-1/2 
        bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none 
        text-xs sm:text-sm font-light py-2 sm:py-2.5 px-8 sm:px-16 lg:px-20 rounded-full cursor-pointer hover:opacity-90 transition-opacity w-fit'>
            Logout
        </button>
    </div>
  )
}

export default RightSidebar
