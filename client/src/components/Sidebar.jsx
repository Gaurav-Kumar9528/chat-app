import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { ChatContext } from '../../context/ChatContext'

const Sidebar = () => {

  const {getUsers, users, selectedUser, setSelectedUser,
      unseenMessages, setUnseenMessages } = useContext(ChatContext)
  

    const {logout, onlineUsers} = useContext(AuthContext) 

    const [input, setInput] = useState(false)

    const navigate = useNavigate();

    const filteredUsers = input ? users.filter((user)=> 
      user.fullName?.toLowerCase().includes(input.toLowerCase())
    ) : users;

    useEffect(()=>{
      getUsers();
    },[onlineUsers])

  return (
    <div className={`
      bg-[#8185B2]/10 
      h-full max-h-screen 
      p-3 sm:p-4 md:p-5 
      rounded-r-xl 
      overflow-y-auto 
      text-white 
      ${selectedUser ? "max-md:hidden" : ''}
    `}>
      {/* Header Section */}
      <div className='pb-3 sm:pb-4 md:pb-5 sticky top-0 bg-[#8185B2]/10 backdrop-blur-sm z-10'>
        <div className='flex justify-between items-center gap-2 mb-3 sm:mb-4'>
          <img 
            src={assets.logo} 
            alt="logo" 
            className='max-w-[120px] sm:max-w-[140px] md:max-w-[160px] h-auto' 
          />
          <div className='relative group'>
            <button className='p-1.5 hover:bg-[#282142]/50 rounded-lg transition-colors'>
              <img src={assets.menu_icon} alt="Menu" className='w-5 h-5 cursor-pointer' />
            </button>
            <div className='absolute top-full right-0 z-20 w-36 p-3 rounded-lg bg-[#282142] border border-gray-600/50 text-gray-100 hidden group-hover:block shadow-lg'>
              <p 
                onClick={()=>navigate('/profile')} 
                className='cursor-pointer text-sm py-2 hover:text-violet-400 transition-colors'
              >
                Edit Profile
              </p>
              <hr className='my-2 border-t border-gray-500/50'/>
              <p 
                onClick={()=> logout()} 
                className='cursor-pointer text-sm py-2 hover:text-violet-400 transition-colors'
              >
                Logout
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className='bg-[#282142] rounded-full flex items-center gap-2 py-2.5 sm:py-3 px-3 sm:px-4'>
          <img src={assets.search_icon} alt="Search" className='w-4 h-4 flex-shrink-0'/>
          <input 
            onChange={(e)=>setInput(e.target.value)} 
            type="text" 
            className='bg-transparent border-none outline-none text-white text-sm placeholder-[#c8c8c8] flex-1 min-w-0' 
            placeholder='Search User...'
          />
        </div>        
      </div>

      {/* Users List */}
      <div className='flex flex-col gap-1'>
        {filteredUsers.length === 0 ? (
          <div className='text-center text-gray-400 py-12'>
            <p className='text-sm sm:text-base'>{input ? 'No users found' : 'No users available'}</p>
          </div>
        ) : (
          filteredUsers.map((user)=>(
            <div 
              onClick={()=> {
                setSelectedUser(user); 
                setUnseenMessages(prev=>({...prev, [user._id]:0}))
              }}
              key={user._id || user.id} 
              className={`
                relative 
                flex items-center gap-3 
                p-2.5 sm:p-3 
                rounded-lg 
                cursor-pointer 
                transition-all duration-200
                active:scale-[0.98]
                ${selectedUser?._id === user._id 
                  ? 'bg-[#282142]/60' 
                  : 'hover:bg-[#282142]/30'
                }
              `}
            >
              <img 
                src={user?.profilePic || assets.avatar_icon} 
                alt={user.fullName} 
                className='w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full flex-shrink-0 object-cover border-2 border-gray-600/50' 
              />
              <div className='flex flex-col min-w-0 flex-1'>
                <p className='text-sm sm:text-base font-medium truncate'>{user.fullName}</p>
                <span className={`text-xs mt-0.5 ${
                  onlineUsers.includes(user._id)
                    ? 'text-green-400' 
                    : 'text-neutral-400'
                }`}>
                  {onlineUsers.includes(user._id) ? 'Online' : 'Offline'}
                </span>
              </div>
              {unseenMessages[user._id] > 0 && (
                <span className='absolute top-2 right-2 sm:top-3 sm:right-3 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500 text-white font-semibold flex-shrink-0'>
                  {unseenMessages[user._id]}
                </span>
              )}
            </div> 
          ))
        )}
      </div>
    </div>
  )
}

export default Sidebar
