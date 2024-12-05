import React, { useEffect } from 'react'
import logo from '../../../../assets/logo.png'
import logoName from '../../../../assets/logo-name.gif'
import ProfileInfo from './component/profile-info'
import NewDM from './component/new-dm'
import { apiClient } from '../../../../lib/api-client'
import { GET_CONTACT, GETALLCHANNELS } from '../../../../utils/constant'
import { useAppStore } from '../../../../store'
import ContactList from '../../../../components/ContactList'
import CreateChannel from './component/create-channel/index.jsx'
import PropTypes from 'prop-types'
import { motion } from 'framer-motion'

const ContactContainer = () => {
  const { setDirectMessageContacts, addChannel, channels } = useAppStore()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Direct Messages
        const { data: contactsData } = await apiClient.get(GET_CONTACT, {
          withCredentials: true
        })
        setDirectMessageContacts(contactsData)

        // Fetch Channels
        const { data: channelsData } = await apiClient.get(GETALLCHANNELS, {
          withCredentials: true
        })
        if (Array.isArray(channelsData)) {
          addChannel(channelsData)
        } else {
          console.error("Received invalid channel data:", channelsData)
        }
      } catch (error) {
        console.error("Error fetching contacts or channels:", error)
      }
    }

    fetchData()
  }, [setDirectMessageContacts, addChannel]) // Added dependencies

  return (
    <motion.div 
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='relative h-full md:w-[35vw] lg:w-[30vw] xl:w-[25vw] bg-gradient-to-r from-gray-900 to-gray-800 border-r border-[#3f4049] shadow-xl w-full'
    >
      {/* Logo Section */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className='flex pt-6 items-center justify-center gap-2'
      >
        <img src={logo} alt="Logo" className="h-8 w-8 hover:scale-110 transition-transform" />
        <img src={logoName} alt="Logo Name" className="h-10 hover:brightness-125 transition-all" />
      </motion.div>

      {/* Direct Messages Section */}
      <div className='mt-8 mb-4 mx-6'>
        <div className='flex items-center justify-between mb-4'>
          <Title text="Direct Messages" />
          <NewDM />
        </div>
        <div className='max-h-[30vh] overflow-y-auto scrollbar-hidden hover:pr-2 transition-all'>
          <ContactList />
        </div>
      </div>

      {/* Channels Section */}
      <div className='mb-4 mx-6'>
        <div className='flex items-center justify-between mb-4'>
          <Title text="Channels" />
          <CreateChannel />
        </div>
        <div className='max-h-[40vh] overflow-y-auto scrollbar-hidden hover:pr-2 transition-all'>
          <ContactList contacts={channels || []} isChannel={true} />
        </div>
      </div>

      {/* Profile Info Section */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="absolute bottom-0 w-full"
      >
        <ProfileInfo />
      </motion.div>
    </motion.div>
  )
}

export default ContactContainer

// Title Component for displaying section headers
const Title = ({ text }) => {
  return (
    <h6 className='uppercase tracking-wider text-neutral-300 font-medium text-sm bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
      {text}
    </h6>
  )
}

// Prop validation for Title component
Title.propTypes = {
  text: PropTypes.string.isRequired,
}
