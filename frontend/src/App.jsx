import {  useUser } from '@clerk/clerk-react'
import { Navigate, Route, Routes } from 'react-router'
import HomePage from './pages/Home'
import ProblemsPage from './pages/Problems'
import { Toaster } from 'react-hot-toast';
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
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
// tw,daisyui , react-router, react-hot-toaster
// todo: react-query aka tanstack query , axios

export default App
