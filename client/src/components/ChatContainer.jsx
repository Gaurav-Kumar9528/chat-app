import React, { useContext, useEffect, useRef, useState } from 'react'
import assets, { messagesDummyData } from '../assets/assets'
import { formatMessageTime } from '../lib/utils'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const ChatContainer = () => {

  const { messages, selectedUser, setSelectedUser, sendMessage, 
      getMessages} = useContext(ChatContext)

  const { authUser, onlineUsers } = useContext(AuthContext)

  const scrollEnd = useRef()

  const [input, setInput] = useState('');

  // Handle sending a message
  const handleSendMessage = async (e)=>{
      e.preventDefault();
      if(input.trim() === "" || !selectedUser) return;
      try {
        await sendMessage({text: input.trim()});
        setInput("")
      } catch (error) {
        console.error("Error sending message:", error);
      }
  }

  // Handle sending an image
  const handleSendImage = async (e) =>{
      const file = e.target.files[0];
      if(!file){
          return;
      }
      if(!file.type.startsWith("image/")){
          toast.error("Please select an image file")
          return;
      }
      // Check file size (max 5MB)
      if(file.size > 5 * 1024 * 1024){
          toast.error("Image size should be less than 5MB")
          return;
      }
      if(!selectedUser){
          toast.error("Please select a user to send image")
          return;
      }
      const reader = new FileReader();

      reader.onloadend = async ()=>{
        try {
          await sendMessage({image: reader.result})
          e.target.value = ""
        } catch (error) {
          console.error("Error sending image:", error);
          toast.error("Failed to send image")
        }
      }
      reader.onerror = () => {
        toast.error("Error reading image file")
      }
      reader.readAsDataURL(file)
  }

  useEffect(()=>{
    if(selectedUser){
        getMessages(selectedUser._id)
    }
  }, [selectedUser])  

  useEffect(()=>{
      if(scrollEnd.current && messages){
          scrollEnd.current.scrollIntoView({ behavior: "smooth"})
      }
  },[messages])

  return selectedUser ? (
    <div className='h-full max-h-screen overflow-hidden relative backdrop-blur-lg flex flex-col'>
      {/* ------- header ------- */}
      <div className='flex items-center gap-2 sm:gap-3 py-2.5 sm:py-3 px-3 sm:px-4 border-b border-stone-500 flex-shrink-0 bg-[#8185B2]/10'>
        <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className='w-8 sm:w-9 md:w-10 rounded-full flex-shrink-0'/>
        <p className='flex-1 text-base sm:text-lg text-white flex items-center gap-2 min-w-0'>
            <span className='truncate font-medium'>{selectedUser.fullName}</span>
            {onlineUsers.includes(selectedUser._id) && <span className='w-2 h-2 rounded-full bg-green-500 flex-shrink-0'></span>}
        </p>
        <button onClick={()=> setSelectedUser(null)} className='md:hidden w-8 h-8 flex items-center justify-center flex-shrink-0 active:opacity-70'>
          <img src={assets.arrow_icon} alt="Back" className='w-6 h-6'/>
        </button>
        <img src={assets.help_icon} alt="Help" className='max-md:hidden w-5 cursor-pointer flex-shrink-0'/>
      </div>
      {/* ------- chat area ------- */}
      <div className='flex flex-col flex-1 overflow-y-auto p-3 sm:p-4 pb-20 sm:pb-24 min-h-0' style={{WebkitOverflowScrolling: 'touch'}}>
        {messages.length === 0 ? (
          <div className='flex flex-col items-center justify-center h-full text-gray-400'>
            <p className='text-sm sm:text-base'>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg)=> (
            <div key={msg._id || msg.id || Date.now() + Math.random()} className={`flex items-end gap-2 mb-3 ${msg.senderId === authUser._id ? 'justify-end' : 'justify-start'}`}> 
                {msg.senderId !== authUser._id && (
                  <div className='text-center flex-shrink-0 order-1'>
                      <img src={selectedUser?.profilePic || assets.avatar_icon} 
                        alt="" className='w-7 h-7 sm:w-8 sm:h-8 rounded-full' />
                      <p className='text-gray-500 text-[10px] mt-1 hidden sm:block'>{formatMessageTime(msg.createdAt)}</p>
                  </div>
                )}
                {msg.image ? (
                   <img src={msg.image} alt="Shared" className={`max-w-[80%] sm:max-w-[60%] md:max-w-[230px] border border-gray-700 rounded-xl overflow-hidden order-2 shadow-lg`}/>
                ):(
                   <p className={`px-4 py-2.5 sm:px-4 sm:py-2.5 max-w-[80%] sm:max-w-[60%] md:max-w-[250px] text-sm sm:text-base rounded-2xl break-words text-white order-2 shadow-sm ${
                    msg.senderId === authUser._id 
                      ? 'bg-violet-500 rounded-br-sm' 
                      : 'bg-gray-700/70 rounded-bl-sm'
                  }`}>{msg.text}</p>
                )}
                {msg.senderId === authUser._id && (
                  <div className='text-center flex-shrink-0 order-3'>
                      <img src={authUser?.profilePic || assets.avatar_icon} 
                        alt="" className='w-7 h-7 sm:w-8 sm:h-8 rounded-full' />
                      <p className='text-gray-500 text-[10px] mt-1 hidden sm:block'>{formatMessageTime(msg.createdAt)}</p>
                  </div>
                )}
            </div>
          ))
        )}
        <div ref={scrollEnd}></div>
      </div>

{/* ------- bottom area ------- */}
    <div className='sticky bottom-0 left-0 right-0 flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-[#8185B2]/10 backdrop-blur-md border-t border-stone-500/50 flex-shrink-0 z-10 safe-area-inset-bottom'>
        <div className='flex-1 flex items-center bg-gray-100/15 px-3 sm:px-4 rounded-full border border-gray-600/30 min-h-[44px]'>
            <input onChange={(e)=> setInput(e.target.value)} value={input} 
            onKeyDown={(e)=> e.key === "Enter" ? handleSendMessage(e) : null} 
            type="text" placeholder='send a message' 
            className='flex-1 text-sm sm:text-base py-2 sm:py-2.5 border-none rounded-lg outline-none text-white placeholder-gray-400 bg-transparent'/>
            <input onChange={handleSendImage} type="file" id='image' accept='image/png, image/jpeg, image/jpg, image/webp' hidden/>
            <label htmlFor="image" className='cursor-pointer active:opacity-70 p-1.5 flex items-center justify-center min-w-[44px] min-h-[44px]'>
                <img src={assets.gallery_icon} alt="Upload image" className='w-5 h-5 sm:w-6 sm:h-6'/>
            </label>
        </div>
        <button onClick={handleSendMessage} disabled={!input.trim()} className='w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed active:opacity-70 bg-violet-500 rounded-full p-2.5 min-w-[44px] min-h-[44px]'>
          <img src={assets.send_button} alt="Send" className='w-5 h-5 sm:w-6 sm:h-6'/>
        </button>
    </div>

    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden h-full'>
        <img src={assets.logo_icon} alt="" className='max-w-16 sm:max-w-20'/>
        <p className='text-base sm:text-lg font-medium text-white'>Chat anytime, anyWhere</p>
    </div>
  )
}

export default ChatContainer
