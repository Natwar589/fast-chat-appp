import React, { useState, useEffect, useCallback } from 'react';
import { FaPlus } from 'react-icons/fa6';
import Lottie from 'react-lottie';
import { animationDefaultOptions } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { toast } from 'sonner';
import { HOST, SERACH_CONTACT } from '../../../../../../utils/constant';
import { apiClient } from '../../../../../../lib/api-client';
import { useAppStore } from '../../../../../../store';

const NewDM = () => {
  const [openNewContactModal, setOpenNewContactModal] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {setSelectedChatType,setSelectedChatData} = useAppStore()

  // Debounce the search input to prevent excessive API calls
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        searchContact(searchTerm);
      } else {
        setSearchedContacts([]);
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const searchContact = useCallback(async (searchTerm) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post(
        `${HOST}/${SERACH_CONTACT}`,
        { searchTerm },
        { withCredentials: true }
      );
      if (response.data) {
        setSearchedContacts(response.data.contact);
      } else {
        setSearchedContacts([]);
        toast.error('No contacts found.');
      }
    } catch (error) {
      console.error('Error while searching contacts:', error);
      toast.error('Error while searching contacts.');
    } finally {
      setIsLoading(false);
    }
  }, []);
   
  const selectNewContact = (contact) =>{
    setOpenNewContactModal(false);
    setSelectedChatType("contact");
    setSelectedChatData(contact)
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => setOpenNewContactModal(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            Select New Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[500px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Select a Contact</DialogTitle>
            <DialogDescription>
              Start typing to search for a contact.
            </DialogDescription>
          </DialogHeader>
          <div className="px-4">
            <input
              type="text"
              className="rounded-lg p-2 w-full bg-[#2c2e3b] border-none outline-none text-white"
              placeholder="Search contact"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex-1 overflow-y-auto mt-4 px-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Lottie
                  options={animationDefaultOptions}
                  height={100}
                  width={100}
                  isClickToPauseDisabled
                />
                <p className="text-opacity-80 text-white mt-4">Loading...</p>
              </div>
            ) : searchedContacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Lottie
                  options={animationDefaultOptions}
                  height={100}
                  width={100}
                  isClickToPauseDisabled
                />
                <h3 className="text-opacity-80 text-white mt-4 text-center text-2xl transition-all duration-300">
                  Hi<span className="text-purple-500">!</span> Search Contacts on
                  <span className="text-purple-500"> FAST</span> Chat App
                  <span className="text-purple-500">.</span>
                </h3>
              </div>
            ) : (
              <ul> 
                {searchedContacts.map((contact) => (
                  <li
                    key={contact._id}
                    className="flex items-center p-2 hover:bg-[#2c2e3b] cursor-pointer rounded-md"
                    // Implement onClick handler to select contact
                    onClick={()=>selectNewContact(contact)}
                  >
                    {contact.profileImage ? (
                      <img
                        src={`${HOST}/${contact.profileImage}`}
                        alt={`${contact.firstName} ${contact.lastName}`}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className="h-10 w-10 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: contact.favoriteColor }}
                      >
                        {contact.firstName
                          ? contact.firstName.charAt(0).toUpperCase()
                          : contact.email.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="ml-3">
                      <p className="text-white font-medium">
                        {contact.firstName} {contact.lastName}
                      </p>
                      <p className="text-sm text-gray-400">{contact.email}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDM;
