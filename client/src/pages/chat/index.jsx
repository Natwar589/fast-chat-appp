import  { useEffect } from 'react'
import { useAppStore } from '../../store'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import ContactContainer from './component/contact-container'
import EmptyChatContainer from './component/empty-chat-container'
import ChatContainer from './component/chat-container'

const Chat = () => {
  const {userInfo,selectedChatType} = useAppStore()
  const navigate = useNavigate();

  useEffect(()=>{
    if(!userInfo.profileSetup)
    {
      toast.error("Please setup the profile to continue")
      navigate('/profile');
    }
  },[userInfo,navigate])
  return (
    <div className='flex h-[100vh] w-full text-white overflow-hidder bg-gradient-to-r from-gray-900 to-gray-800'>
    {/* Contact Container: Always visible on large screens; on small screens, show it only when selectedChatType is undefined */}
    <div className={`flex-1 ${selectedChatType === undefined ? 'visible ' : 'lg:block md:block hidden'}`}>
      <ContactContainer />
    </div>

    {/* Chat container: Shows when selectedChatType is not undefined */}
    <div className={`${selectedChatType === undefined ? ' w-full lg:block sm:block md:block hidden' : 'block'}`}>
      {selectedChatType === undefined ? <EmptyChatContainer /> : <ChatContainer />}
    </div>
  </div>
  )
}

export default Chat
