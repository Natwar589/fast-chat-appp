import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../../../../../../store';
import moment from 'moment';
import { GET_ALL_CHANNEL_MESSAGES, GET_MESSAGES, HOST } from '../../../../../../utils/constant';
import { MdFolderZip, MdDownloadForOffline } from 'react-icons/md';
import { IoMdArrowRoundDown } from "react-icons/io";
import { apiClient } from '../../../../../../lib/api-client';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const MessageContainer = () => {
  const { userInfo, selectedChatMessages, selectedChatData, selectedChatType, setSelectedChatMessages } = useAppStore();
  const messagesEndRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChatMessages]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (selectedChatData && selectedChatType === "contact") {
          const { data } = await apiClient.get(GET_MESSAGES, {
            params: {
              recipient: selectedChatData._id
            },
            withCredentials: true
          });
          setSelectedChatMessages(data || []);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  useEffect(() => {
    const fetchChannelMessage = async () => {
      if (selectedChatType && selectedChatType === 'channel') {
        const { data } = await apiClient.get(GET_ALL_CHANNEL_MESSAGES, {
          params: {
            channelId: selectedChatData._id
          },
          withCredentials: true
        });
        setSelectedChatMessages(data || []);
      }
    };

    fetchChannelMessage();
  }, [selectedChatType, selectedChatData, setSelectedChatMessages]);

  const checkImage = (filePath) => {
    const imageRegex = /\.(jpg|jpeg|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  const handleDownloadFile = async (url) => {
    try {
      const response = await apiClient.get(`${HOST}/${url}`, {
        responseType: "blob"
      });
      const urlBlob = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = urlBlob;
      link.download = url.split('/').pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(urlBlob);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handleImagePreview = (url) => {
    setImagePreview(`${HOST}/${url}`);
  };

  const renderDmMessages = (message, isChannel = false) => (
    <div className={`flex flex-col ${
      isChannel ? 
        message.sender._id === userInfo._id ? "items-end" : "items-start" :
        message.sender === selectedChatData._id ? "items-start" : "items-end"
    }`}>
      <div className={`${
        isChannel ? 
          message.sender._id === userInfo._id ? "bg-indigo-50 text-indigo-600 border-indigo-200" : "bg-gray-800 text-gray-100 border-gray-700" :
          message.sender !== selectedChatData._id ? "bg-indigo-50 text-indigo-600 border-indigo-200" : "bg-gray-800 text-gray-100 border-gray-700"
      } border rounded-2xl px-6 py-3 my-2 max-w-[70%] break-words shadow-md hover:shadow-lg transition-shadow duration-200 word-break`}>
        {message.messageType === "file" ? (
          checkImage(message.fileUrl) ? (
            <div className='relative cursor-pointer group' onClick={() => handleImagePreview(message.fileUrl)}>
              <img
                src={`${HOST}/${message.fileUrl}`} 
                alt="Uploaded content"
                className="max-h-60 max-w-full rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              />
              <div className="opacity-0 group-hover:opacity-100 absolute bottom-0 left-0 right-0 bg-black/60 text-white p-3 transition-opacity duration-200 rounded-b-lg">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDownloadFile(message.fileUrl); }}
                        className="hover:text-indigo-300 transition-colors duration-200"
                      >
                        <MdDownloadForOffline size={25} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-900 border-none mb-2 p-3 text-white rounded-lg">
                      Download
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          ) : (
            <div className='flex items-center justify-between gap-4 p-2 hover:bg-black/5 rounded-lg transition-colors duration-200'>
              <div className='flex items-center gap-3'>
                <MdFolderZip className="text-xl" />
                <span className="font-medium">{message.fileUrl.split("/").pop()}</span>
              </div>
              <button 
                className='bg-gray-700 hover:bg-gray-600 p-2 text-xl rounded-full text-white transition-colors duration-200'
                onClick={() => handleDownloadFile(message.fileUrl)}
              >
                <IoMdArrowRoundDown />
              </button>
            </div>
          )
        ) : (
          <p className="leading-relaxed w-full whitespace-pre-wrap break-words">
            {message.content}
          </p>
        )}
      </div>
      <span className='text-xs text-gray-500 px-2 mt-1'>
        {moment(message.createdAt).format('LT')}
      </span>
    </div>
  );

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages?.map((message, index) => {
      const messageDate = moment(message.createdAt).format('YYYY-MM-DD');
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={message._id || index}>
           {showDate && (
            <div className='text-center my-8 relative'>
              <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent opacity-30"></div>
              <span className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-1.5 relative z-10 text-gray-300 text-sm font-medium rounded-full shadow-inner border border-gray-700/30">
                {moment(message.createdAt).format('LL')}
              </span>
            </div>
          )}
          {renderDmMessages(message)}
        </div>
      );
    });
  };

  const renderChannelMessages = () => {
    let lastDate = null;
    return selectedChatMessages?.map((message, index) => {
      const messageDate = moment(message.createdAt).format('YYYY-MM-DD');
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={message._id || index} className=''>
          {showDate && (
            <div className='text-center my-8 relative'>
              <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent opacity-30"></div>
              <span className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-1.5 relative z-10 text-gray-300 text-sm font-medium rounded-full shadow-inner border border-gray-700/30">
                {moment(message.createdAt).format('LL')}
              </span>
            </div>
          )}
           <div className=' flex-row-reverse items-center justify-center'>
           <div className={`flex flex-col ${message.sender._id === userInfo._id ? 'items-end' : 'items-start'}`}>
            <div className='flex items-center gap-3 mb-2'>
              {message.sender.image ? (
                <img 
                  src={message.sender.image} 
                  alt="profile" 
                  className='w-8 h-8 rounded-full border-2 border-gray-200 shadow-sm' 
                />
              ) : (
                <div className='w-8 h-8 rounded-full border-2 border-gray-200 shadow-sm bg-gray-200 flex items-center justify-center'>
                  <span className='text-gray-600 font-medium'>
                    {message?.sender?.firstName?.charAt(0) || ""}
                  </span>
                </div>
              )}
             <div className='flex flex-col items-start'>
             <span className='text-sm font-medium text-gray-600'>{message.sender.firstName}</span>
             <span className='text-sm font-medium text-gray-600'>{message.sender.email}</span>
             </div>
            </div>
            
          </div>
           <div>
           {renderDmMessages(message, true)}
           </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 scrollbar-hidden px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full bg-gradient-to-r from-gray-900 to-gray-800">
      {imagePreview && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex justify-center items-center backdrop-blur-sm"
          onClick={() => setImagePreview(null)}
        >
          <img 
            src={imagePreview} 
            alt="Preview" 
            className="max-w-[90%] max-h-[90vh] rounded-lg shadow-2xl" 
          />
        </div>
      )}
      <div className="space-y-4">
        {!selectedChatMessages?.length ? (
          <div className="flex flex-col items-center justify-center h-ful gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 text-xl font-medium">Start a new conversation</p>
            <p className="text-gray-400 text-sm">Share your thoughts and connect with others</p>
          </div>
        ) : (
          selectedChatType === 'contact' ? renderMessages() : renderChannelMessages()
        )}
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageContainer;
