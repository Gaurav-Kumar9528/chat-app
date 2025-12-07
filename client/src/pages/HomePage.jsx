import React, { useContext, useState } from 'react'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'
import { ChatContext } from '../../context/ChatContext'

const HomePage = () => {

  const {selectedUser} = useContext(ChatContext)

  return (
    <div className='w-full h-full max-h-screen overflow-hidden p-0 sm:p-2 md:p-4 lg:px-[10%] lg:py-[3%]'>
      <div className={`backdrop-blur-xl border-0 sm:border-2 border-gray-600 rounded-none sm:rounded-lg md:rounded-2xl 
      overflow-hidden h-full max-h-screen grid grid-cols-1 relative ${selectedUser ? 'md:grid-cols-[1fr_1.5fr] lg:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]' : 'md:grid-cols-2'}`}>
        <Sidebar  />
        <ChatContainer />
        <RightSidebar />
      </div>
    </div>
  )
}

export default HomePage
