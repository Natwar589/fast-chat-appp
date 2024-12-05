import { useAppStore } from '../store'

const ContactList = ({isChannel = false}) => {
  const { directMessagesContacts, setSelectedChatType, setSelectedChatData, selectedChatData,channels } = useAppStore()

  const handleContactClick = (contact) => {
    if(isChannel) {
      setSelectedChatType("channel")
      // setSelectedChatMessages([]);
    } else {
      setSelectedChatType("contact") 
      // setSelectedChatMessages([]);
    }
    setSelectedChatData(contact)
  }

  return (
   <>
  { isChannel ? <div>
    <div className="flex flex-col gap-2">
      {channels && channels.map((channel) => (
        <div 
          key={channel._id}
          className={`flex items-center gap-3 px-4 py-2 hover:bg-[#3f4049] cursor-pointer ${
            selectedChatData?._id === channel._id ? 'bg-[#3f4049]' : ''
          }`}
          onClick={() => handleContactClick(channel)}
        >
          <div className="w-10 h-10 rounded-full bg-[#3f4049] flex items-center justify-center text-white">
            {channel?.name && channel.name[0].toUpperCase()}
          </div>
          <span className="text-gray-200 font-medium">
            {channel?.name}
          </span>
        </div>
      ))}
    </div>
    </div> : 
   
   <div className="flex flex-col gap-2">
      {directMessagesContacts && directMessagesContacts?.map((contact) => (
        <div 
          key={contact._id}
          className={`flex items-center gap-3 px-4 py-2 hover:bg-[#3f4049] cursor-pointer ${
            selectedChatData?._id === contact._id ? 'bg-[#3f4049]' : ''
          }`}
          onClick={() => handleContactClick(contact)}
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-[#3f4049] flex items-center justify-center text-white" style={{backgroundColor: contact.favoriteColor}}>
              {contact.firstName ? contact.firstName[0].toUpperCase() : contact.username[0].toUpperCase()}
            </div>
            {contact.unreadMessages > 0 && (
              <div className="absolute -top-1 -right-1 bg-purple-500 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {contact?.unreadMessages}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-gray-200 font-medium">
              {contact.firstName && contact.lastName 
                ? `${contact.firstName} ${contact.lastName}`
                : contact.username}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">{contact.email}</span>
            </div>
          </div> 
        </div>
      ))}
   
   </div>}
   </>
  )
}
       
export default ContactList