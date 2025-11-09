import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from '@clerk/clerk-react'
import toast from 'react-hot-toast'

function HomePage() {
  return (
    <div>
       <SignedOut>
      <SignInButton>
        <button className='cursor-pointer'>Sign In</button>
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
