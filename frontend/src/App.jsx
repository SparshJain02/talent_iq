
import { SignedIn, SignedOut, SignIn, SignInButton, SignOutButton, UserButton } from '@clerk/clerk-react'
import './App.css'

function App() {
  return (
    <>
     <h1>Welcome to our app</h1>
     <SignedOut>
      <SignInButton />
     </SignedOut>

     <SignedIn>
      <UserButton/>
      <SignOutButton/>
     </SignedIn>

     
    </>
  )
}

export default App
