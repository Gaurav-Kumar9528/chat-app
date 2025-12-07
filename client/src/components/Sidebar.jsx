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

    const filteredUsers = input ? users.filter((user)=> user.fullName.toLowerCase().
    includes(input.toLowerCase())) : users;

    useEffect(()=>{
      getUsers();
    },[onlineUsers])

  return (
    <div className={`bg-[#8185B2]/10 h-full p-3 sm:p-4 md:p-5 rounded-r-xl overflow-y-scroll text-white ${selectedUser ? "max-md:hidden" : ''}`}>
      <div className='pb-3 sm:pb-5'>
        <div className='flex justify-between items-center gap-2'>
            <img src={assets.logo} alt="logo" className='max-w-32 sm:max-w-40' />
            <div className='relative py-2 group'>
                <img src={assets.menu_icon} alt="Menu" className='max-h-5 cursor-pointer' />
                <div className='absolute top-full right-0 z-20 w-32 p-3 sm:p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block'>
                    <p onClick={()=>navigate('/profile')} className='cursor-pointer text-xs sm:text-sm hover:text-violet-400 transition-colors'>Edit Profile</p>
                    <hr className='my-2 border-t border-gray-500'/>
                    <p onClick={()=> logout()} className='cursor-pointer text-xs sm:text-sm hover:text-violet-400 transition-colors'>Logout</p>
                </div>
            </div>
        </div>

        <div className='bg-[#282142] rounded-full flex items-center gap-2 py-2 sm:py-3 px-3 sm:px-4 mt-3 sm:mt-5'>
            <img src={assets.search_icon} alt="Search" className='w-3 sm:w-4'/>
            <input onChange={(e)=>setInput(e.target.value)} type="text" className='bg-transparent border-none outline-none text-white text-xs sm:text-sm placeholder-[#c8c8c8] flex-1' placeholder='Search User...'/>
        </div>        

      </div>

      <div className='flex flex-col gap-1'>
          {filteredUsers.map((user, index)=>(
              <div onClick={()=> {setSelectedUser(user); setUnseenMessages(prev=>
              ({...prev, [user._id]:0}))}}
               key={index} className={`relative flex items-center gap-2 p-2 sm:p-3 pl-3 sm:pl-4 rounded cursor-pointer transition-colors hover:bg-[#282142]/30 ${selectedUser?._id === user._id ? 'bg-[#282142]/50' : ''}`}>
                  <img src={user?.profilePic || assets.avatar_icon} alt="" className='w-8 sm:w-9 md:w-[35px] aspect-[1/1] rounded-full flex-shrink-0'/>
                  <div className='flex flex-col leading-tight sm:leading-5 min-w-0 flex-1'>
                      <p className='text-sm sm:text-base truncate'>{user.fullName}</p>
                      {
                        onlineUsers.includes(user._id)
                        ? <span className='text-green-400 text-xs'>Online</span>
                        : <span className='text-neutral-400 text-xs'>Offline</span>
                      }
                  </div>
                  {unseenMessages[user._id] > 0 && <p className='absolute top-2 sm:top-4 right-2 sm:right-4 
                  text-xs h-5 w-5 flex justify-center items-center rounded-full 
                  bg-violet-500/50 flex-shrink-0'>{unseenMessages[user._id]}</p>}
              </div> 
          ) )}
      </div>

    </div>
  )
}

export default Sidebar
