import { RiCloseCircleLine } from 'react-icons/ri'
import { useAppStore } from '../../../../../../store'
import { HOST } from '../../../../../../utils/constant';

const ChatHeader = () => {
    const { closeChat, selectedChatData, selectedChatType } = useAppStore();
    return (
        <div className='h-[10vh] border-b-2 border-[#2f303b] flex items-center px-4 md:px-8 lg:px-12 xl:px-20'>
            <div className='lg:w-[70%] md:w-[60%] w-full'>
                <div className='flex items-center justify-between'>
                    <div
                        key={selectedChatData?._id}
                        className="flex flex-1 items-center gap-3 p-2 hover:bg-[#2c2e3b] cursor-pointer rounded-md overflow-hidden"
                    >
                        {selectedChatType === "channel" ? (
                            <div className="min-w-[2.5rem] h-10 w-10 rounded-full flex items-center justify-center text-white bg-purple-500 shrink-0">
                                #
                            </div>
                        ) : selectedChatData?.profileImage ? (
                            <img
                                src={`${HOST}/${selectedChatData?.profileImage}`}
                                alt={`${selectedChatData?.firstName} ${selectedChatData?.lastName}`}
                                className="min-w-[2.5rem] h-10 w-10 rounded-full object-cover shrink-0"
                            />
                        ) : (
                            <div
                                className="min-w-[2.5rem] h-10 w-10 rounded-full flex items-center justify-center text-white shrink-0"
                                style={{ backgroundColor: selectedChatData.favoriteColor }}
                            >
                                {selectedChatData.firstName
                                    ? selectedChatData.firstName.charAt(0).toUpperCase()
                                    : selectedChatData.email.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div className="flex flex-col min-w-0">
                            <p className="text-white font-medium truncate">
                                {selectedChatType === "channel" 
                                    ? selectedChatData.name
                                    : `${selectedChatData.firstName} ${selectedChatData.lastName}`
                                }
                            </p>
                            {selectedChatType !== "channel" && (
                                <p className="text-sm text-gray-400 truncate">{selectedChatData.email}</p>
                            )}
                        </div>
                    </div>
                    <button 
                        className='ml-4 text-neutral-500 hover:text-white focus:outline-none duration-300 transition-all shrink-0'
                        onClick={closeChat}
                    >
                        <RiCloseCircleLine className='text-[25px]' />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChatHeader
