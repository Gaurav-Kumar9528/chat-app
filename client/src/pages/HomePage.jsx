import React, { useContext } from 'react'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'
import { ChatContext } from '../../context/ChatContext'

const HomePage = () => {
  const {selectedUser} = useContext(ChatContext)

  return (
    <div className='w-full h-screen overflow-hidden p-0 sm:p-2 md:p-4 lg:px-[10%] lg:py-[3%]'>
      <div className={`
        backdrop-blur-xl 
        border-0 sm:border-2 border-gray-600 
        rounded-none sm:rounded-lg md:rounded-2xl 
        overflow-hidden 
        h-full 
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
