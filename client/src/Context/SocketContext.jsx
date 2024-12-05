import { createContext, useContext, useEffect, useRef } from "react";
import { HOST } from "../utils/constant";
import io from "socket.io-client";
import { useAppStore } from "../store";
import PropTypes from 'prop-types';

const SocketContext = createContext();

export const useSocket = () => {
    const socket = useContext(SocketContext);
    if (!socket) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return socket;
}

export const SocketProvider = ({ children }) => {
    const socketRef = useRef(null);
    const { userInfo } = useAppStore();

    useEffect(() => {
        if (userInfo) {
            socketRef.current = io(HOST, {
                withCredentials: true,
                query: { userId: userInfo._id },
            });
            socketRef.current.on("connect", () => {
                console.log("connected to socket");
            });

            socketRef.current.on("recieveMessage", (message) => {
                const { selectedChatData, selectedChatType, addMessage,addContactInContactList } = useAppStore.getState();
                if (selectedChatType === "contact" && selectedChatData && 
                    (selectedChatData._id === message.sender._id || 
                     selectedChatData._id === message.recipient._id)) {
                    addMessage(message);
                }
                addContactInContactList(message)
            });
            
            socketRef.current.on("recieveChannelMessage", (message) => {
                const { selectedChatData, selectedChatType, addMessage,addChannelInChannelList } = useAppStore.getState();
                if (selectedChatType === "channel" && selectedChatData && 
                    selectedChatData._id === message.channel) {
                    addMessage(message);
                }
                addChannelInChannelList(message);
            });

            return () => {
                if (socketRef.current) {
                    socketRef.current.disconnect();
                }
            }
        }
    }, [userInfo]);

    return (
        <SocketContext.Provider value={socketRef.current}>
            {children}
        </SocketContext.Provider>
    )
}

SocketProvider.propTypes = {
    children: PropTypes.node.isRequired
};