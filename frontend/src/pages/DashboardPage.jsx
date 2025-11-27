import React, { useState } from 'react'
import {useUser} from "@clerk/clerk-react"
import Navbar from '../components/Navbar'
import WelcomeSection from '../components/WelcomeSection'
import CreateSessionModal from '../components/CreateSessionModal';
import StatsCard from '../components/StatsCard.jsx';
import { useNavigate } from 'react-router';
import { useActiveSessions, useCreateSession, useMyRecentSessions } from '../hooks/userSessions.js';
import ActiveSessions from '../components/ActiveSessions.jsx';
import RecentSessions from '../components/RecentSessions.jsx';

function DashboardPage() {
  const user = useUser();
  console.log(user.user.id);
  const navigate = useNavigate()
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomConfig,setRoomConfig] = useState({
    problem: "",
    difficulty: ""
  })
  const createSession = useCreateSession();
  const {data:activeSessionsData,isPending:loadingActiveSessions} = useActiveSessions();
  const {data:recentSessionsData,isPending:loadingRecentSessions} = useMyRecentSessions();
  const handleCreateRoom = ()=>{
    if(!roomConfig.problem || !roomConfig.difficulty){
      return;
    }
    console.log(roomConfig);
    createSession.mutate(
      {
      problem: roomConfig.problem,
      difficulty: roomConfig.difficulty
    },
    {
      onSuccess: (data)=>{
        setShowCreateModal(false);
        navigate(`/session/${data.session._id}`)
      },
      onError : (err)=>{
        console.log(err);
      }
    }
  )
  }
  const isUserInSession = (session)=>{
    if(!user) return false;

    const status = session.host?.clerkId === user.user.id || session.participant?.clerkId === user.user.id;
    console.log("isUserInSession: ",status);
    return status;
  }
  const activeSessions = activeSessionsData?.sessions || []; //array of object
  const recentSessions = recentSessionsData?.sessions || [];
  return (
    <>
    <div className="min-h-screen bg-base-300">
      <Navbar/>
      <WelcomeSection onCreateSession={() => setShowCreateModal(true)} />

      {/* GRID LAYOUT */}
      <div className="container mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <StatsCard
            activeSessionsCount = {activeSessions.length}
            recentSessionsCount = {recentSessions.length}
          />
          <ActiveSessions
            sessions = {activeSessions}
            isLoading = {loadingActiveSessions}
            isUserInSession = {isUserInSession}
          />
        </div>
          <RecentSessions
            sessions={recentSessions}
            isLoading={loadingRecentSessions}
          />
      </div>

    </div>
    <CreateSessionModal
      isOpen={showCreateModal}
      onClose = {()=>{setShowCreateModal(false)}}
      roomConfig = {roomConfig}
      setRoomConfig = {setRoomConfig}
      onCreateRoom = {handleCreateRoom}
      isCreating = {createSession.isPending}
    />
    </>
  )
}

export default DashboardPage
