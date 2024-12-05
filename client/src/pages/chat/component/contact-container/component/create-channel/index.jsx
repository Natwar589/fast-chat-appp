import { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import Lottie from 'react-lottie';
import { useAppStore } from '../../../../../../store';
import { CREATECHANNEL, GET_ALL_CONTACT } from '../../../../../../utils/constant';
import { apiClient } from '../../../../../../lib/api-client';
import { animationDefaultOptions } from '../../../../../../lib/utils';

const CreateChannel = () => {
  const {setSelectedChatType,setSelectedChatData, addChannel} = useAppStore()
  const [openCreateChannelModal, setOpenCreateChannelModal] = useState(false);
  const [allContacts, setAllContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [channelName,setChannelName] = useState("")

  useEffect(() => {
    if (openCreateChannelModal) {
      fetchAllContacts();
    }
  }, [openCreateChannelModal]);

  const fetchAllContacts = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(GET_ALL_CONTACT, {
        withCredentials: true
      });
      if (response.data) {
        setAllContacts(response.data.contacts);
      }
    } catch (error) {
      console.error('Error fetching all contacts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreateChannelModal = () => {
    setOpenCreateChannelModal(true);
  };

  const handleSelectContact = (contact) => {
    if (selectedContacts.some(selected => selected._id === contact._id)) {
      setSelectedContacts(selectedContacts.filter(selected => selected._id !== contact._id));
    } else {
      setSelectedContacts([...selectedContacts, contact]);
    }
  };

  const handleCreateChannel = async() => {
    try {
      const response = await apiClient.post(CREATECHANNEL,{name:channelName,members:selectedContacts},{
        withCredentials:true
      })
      if(response.data)
      {
        setChannelName("");
        setSelectedContacts([]);
        setOpenCreateChannelModal(false);
        addChannel(response.data)
      }
    } catch (error) {
      console.error(error)
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={handleOpenCreateChannelModal}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            Create New Channel
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={openCreateChannelModal} onOpenChange={setOpenCreateChannelModal}>
        <DialogContent className="bg-[#2e2f3b] border-none text-white w-[400px] h-[700px] flex flex-col sm:w-[500px] sm:h-[700px]">
          <DialogHeader>
            <DialogTitle>Select Contacts</DialogTitle>
            <DialogDescription>
              Start typing to search for contacts.
            </DialogDescription>
          </DialogHeader>
          <div className="px-4 flex gap-4 flex-col">
           <label className='flex flex-col items-start gap-2'>
             <p>Channel Name</p>
          <input
              type="text"
              className="rounded-lg p-3 w-full bg-[#1c1c20] border-none outline-none text-white"
              placeholder="Channel name"
              value={channelName}
              required
              onChange={(e) => setChannelName(e.target.value)}
            />
            </label>
            <input
              type="text"
              className="rounded-lg p-3 w-full bg-[#1c1c20] border-none outline-none text-white"
              placeholder="Search contacts"
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
            ) : (
              <ul> 
                {Array.isArray(allContacts) && allContacts.filter(contact => {
                  const name = contact?.label;
                  return name?.toLowerCase().includes(searchTerm.toLowerCase());
                }).map((contact) => (
                  <li
                    key={contact._id}
                    className={`flex items-center p-2 mb-2 rounded-md cursor-pointer ${selectedContacts.some(selected => selected._id === contact._id) ? 'bg-[#2c2e3b] border border-blue-300' : 'hover:bg-[#2c2e3b]'}`}
                    onClick={() => handleSelectContact(contact)}
                  >
                    <div
                      className="h-10 w-10 rounded-full flex items-center justify-center text-white bg-black mr-3"
                    >
                      {contact?.label?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="flex-grow">
                      <p className="text-white font-medium">
                        {contact.label} 
                      </p>
                      <p className="text-sm text-gray-400">{contact.email}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <DialogFooter>
            <button
              className="inline-flex items-center px-4 py-4 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={handleCreateChannel}
            >
              Create Channel
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateChannel;
