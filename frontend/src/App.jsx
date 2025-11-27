import {  useUser } from '@clerk/clerk-react'
import ProblemsPage from './pages/ProblemsPage'
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import { Routes,Route,Navigate, useNavigate } from 'react-router';
import DashboardPage from './pages/DashboardPage';
import ProblemPage from './pages/ProblemPage';
import SessionPage from './pages/SessionPage';
function App() {
  // this returns true or false if user is authenticated or not
  const { isSignedIn , isLoaded } = useUser();
  if(!isLoaded) return null;
  return (
    <>
      <Routes>
        <Route path={"/"} element={!isSignedIn?<HomePage />:<Navigate to={"/dashboard"}/>} />
        <Route path='/dashboard' element={isSignedIn?<DashboardPage/>:<Navigate to={"/"} />} />
        <Route path='/problems' element={isSignedIn ? <ProblemsPage /> : <Navigate to={"/"} />} /> {/* if user is not authenticated then return to home page*/}
        <Route path='/problem/:id' element={isSignedIn?<ProblemPage/>:<Navigate to={"/"} />} />
        <Route path='/problem/:id' element={isSignedIn?<ProblemPage/>:<Navigate to={"/"} />} />
        <Route path='/session/:id' element={isSignedIn?<SessionPage />:<Navigate to={"/"}/>}/>
      </Routes>
      <Toaster />

    </>
  )
}
export default App
