import React from 'react'

interface Modal {
    children: React.ReactNode;
}

const Modal = ({children}:Modal) => {
  return (
    <div className='fixed w-screen h-screen flex items-center justify-center'>
        {children}
    </div>
  )
}

export default Modal