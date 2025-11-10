import { Link } from "react-router"
import { ArrowRightIcon, CheckIcon, Code2Icon, SparklesIcon, UsersIcon, VideoIcon, ZapIcon } from 'lucide-react';
import { SignInButton } from "@clerk/clerk-react";
function HomePage() {
  return (
   <div className="bg-linear-to-br from-base-100 via-base-200 to-base-300">
    {/* navbar */}
    <nav className="bg-base-100/80 backdrop-blur-md border-b border-primary/20 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
        {/* Logo */}
        <Link to={"/"}
        className="flex items-center gap-3 hover:scale-105 transiton-transform duration-200"
        >
          <div className="size-10 rounded-xl bg-linear-to-br from-primary via-secondary to-accent flex justify-center items-center shadow-lg">
            <SparklesIcon className="size-6 text-white"/>
          </div>
          <div className="flex flex-col">
            <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-mono tracking-wider">Talent IQ</span>
          </div>
        </Link>

        {/* Auth Btn */}
        <SignInButton mode="modal">
          <button className="group flex items-center gap-2 px-6 py-3 bg-linear-to-r from-primary to-secondary rounded-xl text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 ">
            <span>Get Started</span>
            <ArrowRightIcon className="size-4 group-hover:scale-x-0.5 duration-200 transition-transform"/>
          </button>
        </SignInButton>
        
        </div>
    </nav>
        {/* HERO SECTION */}
        <div className="max-w-7xl mx-auto py-20 px-4">
          <div className="grid lg:grid-cols-2 items-center gap-12">
            
            {/* LEFT CONTENT */}
            <div className="space-y-8">
              <div className="badge badge-primary badge-lg">
                <ZapIcon className="size-4"/>
                Real-time Collaboration
              </div>
              <h1 className="text-5xl lg:text-7xl font-black leading-tight">
                <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Code Together,</span>
                <br />
                <span className="text-base-content">Learn Together</span>
              </h1>
              <p className="text-xl text-base-content/70 leading-relaxed max-w-xl">The ultimate platform for collaborative coding interviews and pair programming. Connect face-to-face , code in real-time, and ace your technical interviews.</p>

              {/* FEATURED PILLS */}
              <div className="flex flex-wrap gap-3">
                <div className="badge badge-outline badge-lg">
                  <CheckIcon className="size-4 text-success translate-y-0.5"/>
                  Live Video Chat
                </div>
                <div className="badge badge-lg badge-outline">
                  <CheckIcon className="text-success size-4 translate-y-0.5"/>
                  Code Editior
                </div>
                <div className="badge badge-lg badge-outline">
                  <CheckIcon className="text-success size-4 translate-y-0.5"/>
                  Multi-Language
                </div>
              </div>

              {/* CTA BUTTONS */}
              <div className="flex flex-wrap gap-4">
                <SignInButton mode="modal">
                  <button className="btn btn-primary btn-lg">
                    Start Coding Now
                    <ArrowRightIcon className="size-5 "/>
                  </button> 
                </SignInButton>

                <button className="btn btn-lg btn-outline gap-2">
                  <VideoIcon className="size-5"/>
                  Watch Demo
                </button>
              </div>
              
              {/* Stats */}
              <div className="stats stats-vertical lg:stats-horizontal bg-base-100 shadow-lg">
                <div className="stat">
                  <div className="stat-value text-primary">10K+</div>
                  <div className="stat-title">Active Users</div>
                </div>
                <div className="stat">
                  <div className="stat-value text-primary">50K+</div>
                  <div className="stat-title">Sessions</div>
                </div>
                <div className="stat">
                  <div className="stat-value text-primary">99.9%</div>
                  <div className="stat-title">Uptime</div>
                </div>
              </div>

            </div>

            {/* RIGHT CONTENT */}
              <img
               src="/hero.png"
               alt="CodeCollab Platform"
               className="w-full h-auto rounder-3xl shadow-2xl border-4 border-base-100 hover:scale-105 transsition-transform duration-200" />
          </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">Everyting you need to <span className="text-primary font-mono">Succeed</span>
        </h2>
        <p className=" text-lg text-base-content/70 max-w-2xl mx-auto">Powerful features designed to make your coding interviews seamless and productive</p>
        </div>

        {/* FEATURES GRID */}
        <div className="grid md:grid-cols-3 gap-8">
            {/* FEATURE 1 */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center items-center">
              <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                <VideoIcon className="size-8 text-primary"/>
              </div>
              <h3 className="card-title">HD Video Call</h3>
              <p className="text-base-content/70">Crystal clear video and audio for seamless communication during interviews</p>
            </div>
          </div>
          {/* FEATURE 2 */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center items-center">
              <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Code2Icon className="size-8 text-primary"/>
              </div>
              <h3 className="card-title">Live Code Editor</h3>
              <p className="text-base-content/70">Collaborate in real-time with syntax highlighting and multiple language support</p>
            </div>
          </div>
          {/* FEATURE 3 */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center items-center">
              <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                <UsersIcon className="size-8 text-primary"/>
              </div>
              <h3 className="card-title">Easy Collaboration</h3>
              <p className="text-base-content/70">Share your screen, discuss solutions, and learn from each other in real-time</p>
            </div>
          </div>
         

        </div>
      </div>
   </div>
  )
}

export default HomePage
