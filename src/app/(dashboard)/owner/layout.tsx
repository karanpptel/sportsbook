import React from 'react'

const layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='px-40'>
      {children}
    </div>
  )
}

export default layout