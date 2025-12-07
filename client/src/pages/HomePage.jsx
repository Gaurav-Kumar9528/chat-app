import React, { useContext } from 'react'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'
import { ChatContext } from '../../context/ChatContext'

const HomePage = () => {
  const {selectedUser} = useContext(ChatContext)

  return (
    <div className='w-full h-full max-h-screen overflow-hidden p-0 sm:p-1 md:p-2 lg:p-4 xl:px-[8%] xl:py-[2%]'>
      <div className={`
        backdrop-blur-xl 
        border-0 sm:border sm:border-gray-600/50 md:border-2 md:border-gray-600 
        rounded-none sm:rounded-lg md:rounded-xl lg:rounded-2xl 
        overflow-hidden 
        h-full max-h-screen 
        grid grid-cols-1 
        relative
        ${selectedUser 
          ? 'md:grid-cols-[280px_1fr] lg:grid-cols-[280px_1fr_280px] xl:grid-cols-[320px_1fr_320px]' 
          : 'md:grid-cols-[280px_1fr] lg:grid-cols-2'
        }
      `}>
        <Sidebar />
        <ChatContainer />
        <RightSidebar />
      </div>
    </div>
  )
}

export default HomePage
