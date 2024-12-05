import { useEffect, useRef, useState } from 'react'; 
import { RiAttachment2, RiEmojiStickerLine } from 'react-icons/ri'; 
import { IoSend } from 'react-icons/io5'; 
import EmojiPicker from 'emoji-picker-react'; 
import { useAppStore } from '../../../../../../store'; 
import { useSocket } from '../../../../../../Context/SocketContext'; 
import { apiClient } from '../../../../../../lib/api-client'; 
import { UPLOAD_FILE } from '../../../../../../utils/constant';  

const MessageBar = () => {   
  const [message, setMessage] = useState('');   
  const fileRef = useRef();   
  const emojiRef = useRef();   
  const textareaRef = useRef();   
  const socket = useSocket();   
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);   
  const { selectedChatType, selectedChatData, userInfo } = useAppStore();    

  const handleAddEmoji = (emoji) => {     
    setMessage((msg) => msg + emoji.emoji);   
  };    

  useEffect(() => {     
    function handleClickOutside(event) {       
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {         
        setEmojiPickerOpen(false);       
      }     
    }     
    document.addEventListener('mousedown', handleClickOutside);     
    return () => {       
      document.removeEventListener('mousedown', handleClickOutside);     
    };   
  }, []);    

  const handleMessageChange = (e) => {     
    setMessage(e.target.value);     
    e.target.style.height = 'auto';     
    e.target.style.height = `${e.target.scrollHeight}px`;   
  };    

  const resetTextareaHeight = () => {     
    if (textareaRef.current) {       
      textareaRef.current.style.height = '40px';       
      textareaRef.current.style.overflow = 'hidden'; // Ensure overflow is hidden to prevent scrollbar     
    }   
  };    

  const handleMessageSend = async () => {     
    if (!message.trim()) return;     
    let messageData;     
    if (selectedChatType === "contact") {       
      messageData = {         
        messageType: "text",         
        content: message.trim(),         
        sender: userInfo._id,         
        recipient: selectedChatData._id,         
        fileUrl: undefined,       
      }       
      try {         
        socket?.emit("sendMessage", messageData);         
        setMessage('');         
        resetTextareaHeight();       
      } catch (error) {         
        console.error("Error sending message:", error);       
      }     
    }     
    else if (selectedChatType === "channel") {       
      messageData = {         
        messageType: "text",         
        content: message.trim(),         
        sender: userInfo._id,         
        channelId: selectedChatData._id,         
        fileUrl: undefined,       
      }       
      try {         
        socket?.emit("sendChannelMessage", messageData);         
        setMessage('');         
        resetTextareaHeight();       
      } catch (error) {         
        console.error("Error sending message:", error);       
      }     
    }   
  };    

  const handleKeyDown = (e) => {     
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {       
      handleMessageSend();     
    }   
  };    

  const handleAttachmentClick = () => {     
    fileRef.current?.click();   
  };    

  const handleAttachmentChange = async (event) => {     
    const file = event.target.files[0];     
    if (file) {       
      const formData = new FormData();       
      formData.append('file', file);        

      try {         
        const response = await apiClient.post(UPLOAD_FILE, formData, {           
          withCredentials: true         
        });          

        if (response.status === 200 && response.data) {           
          let messageData;           
          if (selectedChatType === "contact") {             
            messageData = {               
              sender: userInfo._id,               
              recipient: selectedChatData._id,               
              messageType: "file",               
              fileUrl: response.data.file.path             
            };             
            socket.emit('sendMessage', messageData);           
          } else if (selectedChatType === "channel") {             
            messageData = {               
              sender: userInfo._id,               
              channelId: selectedChatData._id,               
              messageType: "file",               
              fileUrl: response.data.file.path             
            };             
            socket.emit('sendChannelMessage', messageData);           
          }         
        }       
      } catch (error) {         
        console.error("Error uploading file:", error);       
      }     
    }   
  };    

  return (     
    <div className="max-h-[20vh] bg-gradient-to-r from-gray-900 to-gray-800 flex items-end px-4 py-4 sm:px-8  shadow-lg">       
      <div className="flex-1 flex bg-gray-800/50 backdrop-blur-sm rounded-xl items-end gap-4 p-3 border border-gray-700/30 shadow-inner">         
        <textarea           
          ref={textareaRef}           
          className="flex-1 py-2.5 px-4 bg-transparent rounded-lg outline-none border-none resize-none overflow-auto text-gray-100 placeholder-gray-400 transition-all duration-200"           
          placeholder="Cmd/Ctrl + Enter to send"          
          value={message}           
          onChange={handleMessageChange}           
          onKeyDown={handleKeyDown}           
          rows={1}           
          style={{ minHeight: '40px', maxHeight: 'calc(20vh - 40px)' }}         
        />                  

        <div className="flex items-center gap-3">           
          <button              
            className="text-gray-400 hover:text-indigo-400 focus:outline-none focus:text-indigo-400 transition-all duration-300 transform hover:scale-110"             
            onClick={handleAttachmentClick}           
          >             
            <RiAttachment2 className="text-2xl" />           
          </button>                      

          <input type='file' className='hidden' ref={fileRef} onChange={handleAttachmentChange} />            

          <div className="relative" ref={emojiRef}>             
            <button               
              className="text-gray-400 hover:text-indigo-400 focus:outline-none focus:text-indigo-400 transition-all duration-300 transform hover:scale-110"               
              onClick={() => setEmojiPickerOpen((prev) => !prev)}             
            >               
              <RiEmojiStickerLine className="text-2xl" />             
            </button>              

            {emojiPickerOpen && (               
              <div className="absolute bottom-16 right-0 z-50 shadow-2xl rounded-xl overflow-hidden">                 
                <EmojiPicker                   
                  theme="dark"                   
                  onEmojiClick={handleAddEmoji}                   
                  autoFocusSearch={false}                 
                />               
              </div>             
            )}           
          </div>         
        </div>       
      </div>              

      <div className="ml-2">
        <button         
          onClick={handleMessageSend}         
          className="bg-indigo-600 hover:bg-indigo-500 rounded-full flex items-center justify-center lg:w-16 lg:h-16 w-14 h-14 text-white shadow-lg hover:shadow-indigo-500/30 focus:outline-none transition-all duration-300 transform hover:scale-105"       
        >         
          <IoSend className="lg:text-2xl text-xl" />       
        </button>
      </div>     
    </div>   
  ); 
};  

export default MessageBar;
