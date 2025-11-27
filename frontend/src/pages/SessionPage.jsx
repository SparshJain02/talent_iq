import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { useEndSession, useJoinSession, useSessionById } from '../hooks/userSessions.js'
import { useNavigate, useParams } from 'react-router'
import { PROBLEMS } from '../data/problems.js'
import { getDifficultyBageClass } from '../lib/utils.js'
import {  useUser } from '@clerk/clerk-react'
import { Loader2Icon, LogOutIcon, PhoneOffIcon } from 'lucide-react'
import { executeCode } from '../lib/piston.js'
import CodeEditorPanel from '../components/CodeEditorPanel.jsx'
import OutputPanel from '../components/OutputPanel.jsx'
import { useStreamClient } from '../hooks/useStreamClient.js'
import { StreamCall, StreamVideo } from '@stream-io/video-react-sdk'
import VideoCallUI from '../components/VideoCallUI.jsx'

function SessionPage() {
  const navigate = useNavigate()
    const {id} = useParams();
    const {user} = useUser();
    const [selectedLanguage,setSelectedLanguage] = useState("javascript");
    const [starterCode, setStarterCode] = useState("")
    const [isRunning,setIsRunning] = useState(false);
    const [output,setOutput] = useState(null);

    // session
    const sessionResult = useSessionById(id);
    const {data:sessionData, isPending:isSessionLoading,refetch} = sessionResult;
    const session = sessionData?.session
    console.log(session);

    const isHost = session?.host?.clerkId === user?.id;
    const isParticipant = session?.participant?.clerkId === user?.id;

    const problemData = session?.problem ? Object.values(PROBLEMS).find((p)=> p.title === session?.problem):null;

    const endSessionMutation = useEndSession();
    const joinSessionMutation = useJoinSession();

    const {call,channel,chatClient,isInitializingCall,streamClient} = useStreamClient(session,isSessionLoading,isHost,isParticipant);


    // handlers
    const handleLanguageChange = (newlang)=>{
      setSelectedLanguage(newlang)
      setStarterCode(problemData?.starterCode?.[newlang] || "")
      setOutput(null);
    }

    const handleRunCode = async() =>{
      setIsRunning(true);
      setOutput(null);
      const result = await executeCode(selectedLanguage,starterCode);
      console.log(result);
      setOutput(result);
      setIsRunning(false);
    }
    const handleEndSession = ()=>{
      if(confirm("Are you sure you want to end Session. All Participant will be notified.")){
        endSessionMutation.mutate(id,{onSuccess: () => {navigate("/dashboard")}})
      }
    }


    useEffect(()=>{
      setStarterCode(problemData?.starterCode[selectedLanguage])
    },[selectedLanguage,problemData])

    useEffect(()=>{
      if(!session || isSessionLoading) return
      if(session.status === "completed"){
        navigate("/dashboard");
      }
    },[session,navigate,isSessionLoading])

    useEffect(()=>{
      // goal: to join the session if he redirects to this page 
      if(!user || !session || isSessionLoading || !id){
        return
      }
      if(isHost || isParticipant) return

      joinSessionMutation.mutate(id,{
        onSuccess: ()=>refetch,
        onError: ()=>navigate("/dashboard")
      })
    },[isHost,isParticipant,session,user,isSessionLoading,id,navigate])
    

  return (
    <div className="h-screen bg-base-100 flex flex-col">
      <Navbar />
      <div className="flex-1">
        <PanelGroup direction='horizontal'>
            {/* LEFT PANEL - CODE EDITOR & PROBLEM DETAILS */}
            <Panel defaultSize={50} minSize={30}>
                <PanelGroup> {/* -> left top panel */}
                  {/* PROBLEM DSC PANEL */}
                  <Panel defaultSize={50} >
                    <div className="h-full overflow-y-auto bg-base-200">
                        {/* HEADER SECTION */}
                        <div className="p-6 bg-base-100 border-b border-base-300">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h1 className="text-3xl font-bold text-base-content">
                                      {session?.problem || "Loading..."}
                                    </h1>
                                    {problemData?.category && (
                                      <p className="text-base-content/60 mt-1">{problemData.category}</p>
                                    )}
                                    <p className="text-base-content/60 mt-2">Host: {session?.host?.name || "Loading..."} •{" "}
                                      {session?.participant ? 2:1}/2 participants
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span
                                      className={`badge badge-sm ${getDifficultyBageClass(problemData?.difficulty || "easy") }`}
                                    >
                                      {problemData?.difficulty[0].toUpperCase()}{problemData?.difficulty.slice(1)}
                                    </span>
                                    {isHost && session?.status === "active" && (
                                      <button
                                        className="btn btn-error btn-sm gap-2"
                                        onClick={handleEndSession}
                                        disabled={endSessionMutation.isPending}
                                      >
                                        {endSessionMutation.isPending ? (
                                          <Loader2Icon className="w-4 h-4 animate-spin"/>
                                        ):(
                                          <LogOutIcon className='w-4 h-4'/>
                                        )}
                                        End Session
                                      </button>
                                    )}
                                    {session?.status === "completed" && (
                                      <span className="badge badge-ghost badge-lg">Completed</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                          {/* problem desc */}
                          {problemData?.description && (
                            <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
                              <h2 className="text-xl font-bold mb-4 text-base-content">Description</h2>
                              <div className="space-y-3 text-base leading-relaxed">
                                <p className="text-base-content/90">{problemData.description.text}</p>
                                {problemData.description.notes.map((note,idx)=>(
                                  <p key={idx} className="text-base-content/90">{note}</p>
                                ))}
                              </div>
                            </div>
                          )}
                        {/* examples section */}
                        {problemData?.examples && problemData?.examples.length>0 && (
                          <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
                            <h2 className="text-xl font-bold mb-4 text-base-content">Examples</h2>

                            <div className="space-y-4" >
                              {problemData.examples.map((example,idx)=>(
                                <div key={idx}>
                                  <div className="flex items-center gap-2 mb-2" >
                                    <span className="badge badge-sm">{idx+1}</span>
                                    <p className="font-semibold text-base-content">Example {idx+1}</p>
                                  </div>
                                  <div className="bg-base-200 rounded-lg p-4 font-mono text-sm space-y-1.5">
                                    <div className="flex gap-2">
                                      <span className="text-primary font-bold min-w-[70px]">Input:</span>
                                      <span>{example.input}</span>
                                    </div>
                                    <div className="flex gap-2">
                                      <span className="text-secondary font-bold min-w-[70px]">Output:</span>
                                      <span>{example.output}</span>
                                    </div>
                                    {example.explanation && (
                                      <div>
                                        <span className="text-base-content/60 font-sans text-xs">
                                          <span className="font-semibold">Explanation: </span>{" "}
                                          {example.explanation}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {/* Constraints */}
                        {problemData?.constraints && problemData?.constraints.length>0 && (
                          <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
                            <h2 className="text-xl font-bold mb-4 text-base-content">Constraints</h2>
                            <ul className="space-y-2 text-base-content/90">
                              {problemData.constraints.map((constraint,idx)=>(
                                <li key={idx} className="flex gap-2">
                                  <span className="text-primary">•</span>
                                  <code className="text-sm">{constraint}</code>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        </div>
                    </div>
                  </Panel>

                  <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize"/>
                  <Panel defaultSize={50}>
                    <PanelGroup direction="vertical">
                        <Panel defaultSize={70}>
                          <CodeEditorPanel
                            selectedLanguage={selectedLanguage}
                            code={starterCode}
                            isRunning={isRunning}
                            onLanguageChange={handleLanguageChange}
                            onCodeChange={(value)=>setStarterCode(value)}
                            onRunCode={handleRunCode}
                          />
                        </Panel>
                        <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />
                        <Panel defaultSize={50}>
                          <OutputPanel output={output}/>
                        </Panel>
                    </PanelGroup>
                  </Panel>
                </PanelGroup>
            </Panel>

            <PanelResizeHandle className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />

            {/* RIGHT PANEL - VIDEO CALLS & CHAT */}
            <Panel defaultSize={50} minSize={30}>
              <div className="h-full bg-base-200 p-4 overflow-auto">
                {isInitializingCall? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <Loader2Icon className="w-12 h-12 mx-auto animate-spin text-primary mb-4"/>
                      <p className="text-lg">Connecting to video call...</p>
                    </div>
                  </div>
                ):!streamClient || !call ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="card bg-base-100 shadow-xl max-w-md">
                      <div className="card-body items-center text-center">
                        <div className="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center mb-4">
                          <PhoneOffIcon className="w-12 h-12 text-error"/>
                        </div>
                        <h2 className="card-title text-2xl">Connection Failed</h2>
                        <p lassName="text-base-content/70">Unable to conect to the video call</p>
                      </div>
                    </div>
                  </div>
                ): (
                  <div className="h-full">
                    <StreamVideo client={streamClient}>
                      <StreamCall call={call}>
                        <VideoCallUI chatClient={chatClient} channel={channel} />
                      </StreamCall>
                    </StreamVideo>
                  </div>

                )}
              </div>
            </Panel>
        </PanelGroup>
      </div>
    </div>
  )
}

export default SessionPage
