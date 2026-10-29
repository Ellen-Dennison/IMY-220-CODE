import { useState } from 'react'
import AuthForm from '../components/AuthForm'
import grandparents from '../assets/images/grandparents.jpg'


const PLACEHOLDERS = [
  'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&q=80&w=400&h=400',
  'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=400&h=400',
  'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=400&h=400'
]

function Polaroid() {
  // Randomize the placeholder image on load
  const [randomImg] = useState(() => PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)])

  return (
    <div className="relative flex justify-center py-10 lg:py-0">
      <figure className="polaroid w-[min(22rem,80vw)] rounded-[1.5rem] border-[0.8rem] border-leaf bg-white p-3 lg:w-[min(24rem,26vw)]">
        {/* Tape effects */}
        <div className="tape tape-top-left" />
        <div className="tape tape-bottom-right" />
        
        <div className="relative bg-white border-2 border-gray-200 p-2">
          <img
            src={grandparents} 
            
            // Fallback
            onError={(e) => { e.target.src = randomImg }}
            alt="An older couple waving at the camera"
            className="aspect-square w-full object-cover"
          />
        </div>
        <figcaption className="mt-3 whitespace-nowrap text-center font-script text-3xl text-ink">
          GrandMa and GrandPa
        </figcaption>
      </figure>
    </div>
  )
}

export default function Splash({ onAuth }) {
  const [mode, setMode] = useState(null) // null | 'login' | 'register'

  return (
    <main className="min-h-screen overflow-hidden bg-hot text-white">
      {/* 
        Using a relative container so we can absolutely position the SVG dashed line 
        between the text and the polaroid on large screens.
      */}
      <div className="relative mx-auto grid min-h-screen max-w-6xl grid-cols-1 items-center gap-12 px-6 py-10 lg:grid-cols-[1.2fr_1fr] lg:px-12">
        
        {/* Left Column: Logo & Forms */}
        <section className="flex flex-col gap-6 z-10 mr-10">
          <h1 className="wordmark font-display text-[clamp(4rem,10vw,9rem)] leading-[0.9]">
            GRAMBLE
          </h1>

          {mode ? (
            <AuthForm key={mode} mode={mode} onSuccess={onAuth} onSwitch={setMode} onClose={() => setMode(null)} />
          ) : (
            <>
              <div className="relative max-w-[35ch] mt-10">
                <p className="text-[clamp(0.5rem,8vw,2.5rem)] leading-tight">
                  The best place to share your images!
                </p>
              </div>
              <div className="flex flex-wrap gap-5 mt-4">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="cursor-pointer bg-azure px-8 py-3 text-2xl font-semibold text-ink hover:brightness-110 border-2 border-transparent transition-all"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="cursor-pointer bg-azure px-8 py-3 text-2xl font-semibold text-ink hover:brightness-110 border-2 border-transparent transition-all"
                >
                  SignUp
                </button>
              </div>
            </>
          )}
        </section>

        {/* Right Column: Polaroid */}
        <div className="relative">
          <Polaroid />
        </div>

        {/* Dashed Connector Line (Only visible on large screens, behind the elements) */}
        <div className="hidden lg:block absolute top-[55%] left-[35%] w-[25%] z-0 opacity-50 pointer-events-none">
          <svg width="100%" height="100" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 0 50 C 50 50, 150 50, 200 20" className="dashed-line" strokeLinecap="round" />
            {/* Little circle at the end of the line */}
            <circle cx="200" cy="20" r="4" fill="var(--color-ink)" />
          </svg>
        </div>
      </div>
    </main>
  )
}