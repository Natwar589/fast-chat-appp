import Lottie from 'react-lottie'
import { animationDefaultOptions } from '../../../../lib/utils'
import { BsChatDots } from 'react-icons/bs'
import { FiUsers } from 'react-icons/fi'
import { RiChatSmile2Line } from 'react-icons/ri'

const EmptyChatContainer = () => {
  return (
    <div className='mx-auto w-full h-full flex-1 bg-gradient-to-r from-gray-900 to-gray-800 flex flex-col justify-center items-center duration-1000 transition-all p-4'>
      <div className='flex flex-col items-center justify-center w-full max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='w-full max-w-[250px] sm:max-w-[300px] md:max-w-[350px]'>
          <Lottie
            isClickToPauseDisabled={true}
            height="100%"
            width="100%"
            options={animationDefaultOptions}
          />
        </div>
        <div className='text-opacity-80 text-white flex flex-col gap-4 sm:gap-6 items-center mt-6 sm:mt-10 transition-all duration-300 text-center'>
          <h3 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent'>
            Welcome to FAST Chat
          </h3>
          <p className='text-gray-400 text-base sm:text-lg max-w-xl px-4'>
            Connect, chat and collaborate in real-time with friends and colleagues
          </p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mt-8 sm:mt-12 w-full'>
          <div className='bg-gray-800/50 p-4 sm:p-6 rounded-xl border border-gray-700/30 backdrop-blur-sm'>
            <div className='bg-indigo-500/10 p-3 rounded-lg w-fit'>
              <BsChatDots className='text-xl sm:text-2xl text-indigo-400' />
            </div>
            <h4 className='text-white font-semibold mt-3 sm:mt-4'>Real-time Chat</h4>
            <p className='text-gray-400 text-xs sm:text-sm mt-2'>Instant messaging with real-time updates</p>
          </div>

          <div className='bg-gray-800/50 p-4 sm:p-6 rounded-xl border border-gray-700/30 backdrop-blur-sm'>
            <div className='bg-purple-500/10 p-3 rounded-lg w-fit'>
              <FiUsers className='text-xl sm:text-2xl text-purple-400' />
            </div>
            <h4 className='text-white font-semibold mt-3 sm:mt-4'>Group Channels</h4>
            <p className='text-gray-400 text-xs sm:text-sm mt-2'>Create and join group conversations</p>
          </div>

          <div className='bg-gray-800/50 p-4 sm:p-6 rounded-xl border border-gray-700/30 backdrop-blur-sm sm:col-span-2 lg:col-span-1'>
            <div className='bg-pink-500/10 p-3 rounded-lg w-fit'>
              <RiChatSmile2Line className='text-xl sm:text-2xl text-pink-400' />
            </div>
            <h4 className='text-white font-semibold mt-3 sm:mt-4'>Rich Messages</h4>
            <p className='text-gray-400 text-xs sm:text-sm mt-2'>Share files, emojis and more</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmptyChatContainer
