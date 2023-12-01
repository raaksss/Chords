import React from 'react'
import SendbirdApp from "@sendbird/uikit-react/App";
import "@sendbird/uikit-react/dist/index.css";
import '../styles/messages.css'

const Messages = () => {
  const username = localStorage.getItem('username');
  const name = localStorage.getItem('name');
  return (
    <div className='App'>
        <SendbirdApp
                appId='334E409D-0888-4D89-91C9-A3D967DAC5C7' 
                userId={username} 
                nickname={name} 
                theme="dark"   
            />
    </div>
  )
}

export default Messages
