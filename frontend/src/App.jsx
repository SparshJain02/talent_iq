import {  useUser } from '@clerk/clerk-react'
import ProblemsPage from './pages/Problems'
import { Toaster } from 'react-hot-toast';
function App() {
  // this returns true or false if user is authenticated or not
  const { isSignedIn } = useUser();
  return (
    <>
      <Routes>
        <Route path={"/"} element={<HomePage />} />
        <Route path='/problem' element={isSignedIn ? <ProblemsPage /> : <Navigate to={"/"} />} /> {/* if user is not authenticated then return to home page*/}
      </Routes>
      <Toaster />

    </>
  )
}
export default App
