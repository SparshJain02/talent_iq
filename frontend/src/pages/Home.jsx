import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from '@clerk/clerk-react'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'

function HomePage() {
  return (
    <div>
       <SignedOut>
      <SignInButton>
        <button className='cursor-pointer' onClick={()=>{toast.success("ahh you clicked me!")}}>Sign In</button>
      </SignInButton>
     </SignedOut>
     <SignedIn>
      <UserButton/>
      <SignOutButton/>
     </SignedIn>

    </div>
  )
}

export default HomePage
