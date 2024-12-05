import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAppStore } from '@/store';
import { apiClient } from '@/lib/api-client';
import { HOST, LOGOUT_USER } from '@/utils/constant';
import { toast } from 'sonner';
import { FiEdit } from 'react-icons/fi'
import { FaPowerOff } from "react-icons/fa6";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useNavigate } from 'react-router-dom';

const ProfileInfo = () => {
    const { userInfo, setUserInfo } = useAppStore();
    const navigate = useNavigate();
    const logoutHandler = async () => {
        try {
            const response = await apiClient.post(`${HOST}/${LOGOUT_USER}`)
            if (response.data.success) {
                toast.success(response.data.message);
                setUserInfo(null);
            }
        } catch (error) {
            toast.error(response.data.error)
        }
    }
    return (
        <div className="absolute bottom-0 h-16 w-full bg-[#2a2b33] flex items-center justify-center gap-2">
            <div className="flex gap-3 items-center">
                <div className="w-12 h-12 relative">
                    <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                        {userInfo.image ? (
                            <AvatarImage src={userInfo.image} alt="User Profile" />
                        ) : (
                            <AvatarFallback
                                className="uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center text-white"
                                style={{ backgroundColor: userInfo.favoriteColor }}>
                                {userInfo.firstName
                                    ? userInfo.firstName.charAt(0).toUpperCase()
                                    : userInfo.email.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        )}
                    </Avatar>
                </div>
                <span className="text-white font-medium">
                    {userInfo.firstName + " " + userInfo.lastName || userInfo.email}
                </span>
            </div>
            <button
                onClick={() => navigate('/profile')}>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger><FiEdit /></TooltipTrigger>
                        <TooltipContent>
                            <p>Edit Profile</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </button>
            <button
                onClick={logoutHandler}
                className="text-white hover:text-red-500 transition duration-300"
            >
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger><FaPowerOff /></TooltipTrigger>
                        <TooltipContent>
                            <p>Log Out</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>


            </button>
        </div>
    );
};

export default ProfileInfo;
