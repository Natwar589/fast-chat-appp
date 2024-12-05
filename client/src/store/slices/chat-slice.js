
export const createChatSlice = (set, get) => ({
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [],
    directMessagesContacts: [],
    channels: [],
    setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
    setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
    setSelectedChatMessages: (selectedChatMessages) => set({ selectedChatMessages }),
    setDirectMessageContacts: (directMessagesContacts) => set({ directMessagesContacts }),
    addChannel: (channel) => {
        const channels = get().channels;
        if (!channels.length) {
            if (channel.length > 1)
                set({ channels: channel });
            else if(channel.length===1)
                set({ channels: [channel] })
        } else {
            set({ channels: [...channels, channel] });
        }
    },
    closeChat: () => set({
        selectedChatData: undefined,
        selectedChatType: undefined,
        selectedChatMessages: undefined // Fixed typo
    }),
    addMessage: (message) => {
        const selectedChatMessages = get().selectedChatMessages; // Fixed typo
        const selectedChatType = get().selectedChatType;

        // Check if selectedChatMessages exists, if not initialize as empty array
        const currentMessages = selectedChatMessages || [];

        // Create new message object
        const newMessage = {
            ...message,
            recipient: selectedChatType === "channel" ? message.recipient : message.recipient._id,
            sender: selectedChatType === "channel" ? message.sender : message.sender._id
        };

        // Add new message to existing messages array
        set({
            selectedChatMessages: [...currentMessages, newMessage]
        });
    },
    addChannelInChannelList: (message) => {
        const channels = get().channels;
        
        const index = channels.findIndex((channel) => channel._id === message.channel);
        console.log(channels,index,message)
        if (index !== -1) {
            const [updatedChannel] = channels.splice(index, 1);
            channels.unshift(updatedChannel);
        }
    },
    addContactInContactList: (message) => {
        const userId = get().userInfo._id;
        const fromId = message.sender?._id === userId ? message.recipient?._id : message.sender?._id;
        const fromData = message.sender._id === userId? message.recipient : message.sender;
        const dmContacts = get().directMessagesContacts;
        const data = dmContacts.find((contact)=> contact._id === fromId);
        const index = dmContacts.findIndex((contact) => contact._id === fromId);
        console.log({data,index,dmContacts,userId,message,fromData});
        if(index!==-1 && index!== undefined) {
            console.log("in if");
            dmContacts.splice(index,1);
            dmContacts.unshift(data);
        }
        else{
            console.log("in else");
            dmContacts.unshift(fromData);

            
        }
        set({directMessagesContacts:dmContacts})
}
})