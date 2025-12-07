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
    <div className='h-full max-h-screen overflow-hidden relative backdrop-blur-lg flex flex-col bg-gradient-to-b from-[#8185B2]/5 to-transparent'>
      {/* Chat Header */}
      <div className='flex items-center gap-3 py-3 px-4 sm:px-5 border-b border-stone-500/50 flex-shrink-0 bg-[#8185B2]/10 backdrop-blur-sm sticky top-0 z-10'>
        <img 
          src={selectedUser.profilePic || assets.avatar_icon} 
          alt={selectedUser.fullName} 
          className='w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full flex-shrink-0 object-cover border-2 border-gray-600/50' 
        />
        <div className='flex-1 text-white flex items-center gap-2 min-w-0'>
          <span className='truncate font-medium text-base sm:text-lg'>{selectedUser.fullName}</span>
          {onlineUsers.includes(selectedUser._id) && (
            <span className='w-2 h-2 rounded-full bg-green-500 flex-shrink-0 animate-pulse'></span>
          )}
        </div>
        <button 
          onClick={()=> setSelectedUser(null)} 
          className='md:hidden w-9 h-9 flex items-center justify-center flex-shrink-0 hover:bg-[#282142]/50 rounded-lg transition-colors active:scale-95'
        >
          <img src={assets.arrow_icon} alt="Back" className='w-5 h-5'/>
        </button>
        <button className='max-md:hidden w-9 h-9 flex items-center justify-center flex-shrink-0 hover:bg-[#282142]/50 rounded-lg transition-colors'>
          <img src={assets.help_icon} alt="Help" className='w-5 h-5'/>
        </button>
      </div>

      {/* Messages Area */}
      <div 
        className='flex flex-col flex-1 overflow-y-auto p-4 sm:p-5 md:p-6 pb-20 sm:pb-24 min-h-0' 
        style={{WebkitOverflowScrolling: 'touch'}}
      >
        {messages.length === 0 ? (
          <div className='flex flex-col items-center justify-center h-full text-gray-400'>
            <img src={assets.logo_icon} alt="" className='w-16 h-16 sm:w-20 sm:h-20 opacity-50 mb-4'/>
            <p className='text-sm sm:text-base'>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg)=> (
            <div 
              key={msg._id || msg.id || Date.now() + Math.random()} 
              className={`flex items-end gap-2 sm:gap-3 mb-3 sm:mb-4 ${
                msg.senderId === authUser._id ? 'justify-end' : 'justify-start'
              }`}
            > 
              {msg.senderId !== authUser._id && (
                <div className='text-center flex-shrink-0 order-1'>
                  <img 
                    src={selectedUser?.profilePic || assets.avatar_icon} 
                    alt={selectedUser?.fullName} 
                    className='w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-gray-600/50' 
                  />
                  <p className='text-gray-500 text-[10px] mt-1 hidden sm:block'>
                    {formatMessageTime(msg.createdAt)}
                  </p>
                </div>
              )}
              {msg.image ? (
                <img 
                  src={msg.image} 
                  alt="Shared" 
                  className='max-w-[75%] sm:max-w-[55%] md:max-w-[400px] border border-gray-700/50 rounded-2xl overflow-hidden order-2 shadow-lg cursor-pointer hover:opacity-90 transition-opacity' 
                  onClick={() => window.open(msg.image, '_blank')}
                />
              ) : (
                <p className={`
                  px-4 py-2.5 sm:px-5 sm:py-3 
                  max-w-[75%] sm:max-w-[55%] md:max-w-[400px] 
                  text-sm sm:text-base 
                  rounded-2xl break-words text-white order-2 shadow-md
                  ${msg.senderId === authUser._id 
                    ? 'bg-violet-500 rounded-br-sm' 
                    : 'bg-gray-700/70 rounded-bl-sm'
                  }
                `}>
                  {msg.text}
                </p>
              )}
              {msg.senderId === authUser._id && (
                <div className='text-center flex-shrink-0 order-3'>
                  <img 
                    src={authUser?.profilePic || assets.avatar_icon} 
                    alt={authUser?.fullName} 
                    className='w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-gray-600/50' 
                  />
                  <p className='text-gray-500 text-[10px] mt-1 hidden sm:block'>
                    {formatMessageTime(msg.createdAt)}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={scrollEnd}></div>
      </div>

      {/* Input Area */}
      <div className='sticky bottom-0 left-0 right-0 flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-[#8185B2]/10 backdrop-blur-md border-t border-stone-500/50 flex-shrink-0 z-10'>
        <div className='flex-1 flex items-center bg-gray-100/15 px-3 sm:px-4 rounded-full border border-gray-600/30 min-h-[48px] sm:min-h-[52px]'>
          <input 
            onChange={(e)=> setInput(e.target.value)} 
            value={input} 
            onKeyDown={(e)=> e.key === "Enter" && !e.shiftKey ? handleSendMessage(e) : null} 
            type="text" 
            placeholder='Type a message...' 
            className='flex-1 text-sm sm:text-base py-2.5 sm:py-3 border-none rounded-lg outline-none text-white placeholder-gray-400 bg-transparent min-w-0' 
          />
          <input 
            onChange={handleSendImage} 
            type="file" 
            id='image' 
            accept='image/png, image/jpeg, image/jpg, image/webp' 
            hidden 
          />
          <label 
            htmlFor="image" 
            className='cursor-pointer active:opacity-70 p-2 flex items-center justify-center min-w-[44px] min-h-[44px] hover:bg-gray-100/10 rounded-lg transition-colors'
          >
            <img src={assets.gallery_icon} alt="Upload image" className='w-5 h-5 sm:w-6 sm:h-6'/>
          </label>
        </div>
        <button 
          onClick={handleSendMessage} 
          disabled={!input.trim()} 
          className='w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 bg-violet-500 hover:bg-violet-600 rounded-full p-2.5 min-w-[44px] min-h-[44px] transition-all shadow-lg'
        >
          <img src={assets.send_button} alt="Send" className='w-5 h-5 sm:w-6 sm:h-6'/>
        </button>
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-4 text-gray-400 bg-white/5 max-md:hidden h-full'>
      <img src={assets.logo_icon} alt="Logo" className='w-20 h-20 sm:w-24 sm:h-24 opacity-60'/>
      <p className='text-lg sm:text-xl font-medium text-white/80'>Chat anytime, anywhere</p>
      <p className='text-sm text-gray-500'>Select a user to start chatting</p>
    </div>
  )
}

export default ChatContainer
