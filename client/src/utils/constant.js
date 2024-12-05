export const HOST = import.meta.env.VITE_SERVER_URL;
export const AUTH_ROUTE = 'api/auth'

export const SIGN_UP = `${AUTH_ROUTE}/signup`
export const LOGIN = `${AUTH_ROUTE}/login`
export const GET_USER_INFO = `${AUTH_ROUTE}/userInfo`
export const UPDATE_USER_INFO = `${AUTH_ROUTE}/updateProfile`
export const LOGOUT_USER = `${AUTH_ROUTE}/logout`


export const CONTACT_ROUTE = 'api/contact'
export const SERACH_CONTACT = `${CONTACT_ROUTE}/search`
export const GET_CONTACT = `${CONTACT_ROUTE}/get-contact`
export const GET_ALL_CONTACT = `${CONTACT_ROUTE}/get-all-contact`

export const MESSAGES_ROUTE = 'api/messages'
export const GET_MESSAGES = `${MESSAGES_ROUTE}/get-message`
export const UPLOAD_FILE = `${MESSAGES_ROUTE}/uploadfile`


export const CHANNELROUTES = 'api/channel'
export const CREATECHANNEL = `${CHANNELROUTES}/create-channel`
export const GETALLCHANNELS = `${CHANNELROUTES}/get-channels`
export const GET_ALL_CHANNEL_MESSAGES = `${CHANNELROUTES}/get-all-channel-message`
