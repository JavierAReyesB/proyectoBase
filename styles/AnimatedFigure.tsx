"use client"

export default function AnimatedFigure() {
  return (
    <>
      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }

        .preserve-3d {
          transform-style: preserve-3d;
        }

        .cube-container {
          width: 120px;
          height: 120px;
          position: relative;
          transform-style: preserve-3d;
        }

        .cube-face {
          position: absolute;
          width: 120px;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          backface-visibility: visible;
        }

        .front {
          transform: translateZ(60px);
        }
        .back {
          transform: rotateY(180deg) translateZ(60px);
        }
        .right {
          transform: rotateY(90deg) translateZ(60px);
        }
        .left {
          transform: rotateY(-90deg) translateZ(60px);
        }
        .top {
          transform: rotateX(90deg) translateZ(60px);
        }
        .bottom {
          transform: rotateX(-90deg) translateZ(60px);
        }

        .ring-3d {
          width: 200px;
          height: 200px;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .text-3d {
          text-shadow:
            0 1px 0 #ccc,
            0 2px 0 #c9c9c9,
            0 3px 0 #bbb,
            0 4px 0 #b9b9b9,
            0 5px 0 #aaa,
            0 6px 1px rgba(0, 0, 0, 0.1),
            0 0 5px rgba(0, 0, 0, 0.1),
            0 1px 3px rgba(0, 0, 0, 0.3),
            0 3px 5px rgba(0, 0, 0, 0.2),
            0 5px 10px rgba(0, 0, 0, 0.25);
        }

        @keyframes rotate-3d {
          0% {
            transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
          }
          33% {
            transform: rotateX(360deg) rotateY(180deg) rotateZ(120deg);
          }
          66% {
            transform: rotateX(180deg) rotateY(360deg) rotateZ(240deg);
          }
          100% {
            transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg);
          }
        }

        @keyframes zoom-in-out {
          0% {
            transform: scale(0.3);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(0.8);
          }
        }

        @keyframes orbit-x {
          0% {
            transform: rotateX(0deg);
          }
          100% {
            transform: rotateX(360deg);
          }
        }

        @keyframes orbit-y {
          0% {
            transform: rotateY(0deg);
          }
          100% {
            transform: rotateY(360deg);
          }
        }

        @keyframes orbit-z {
          0% {
            transform: rotateZ(0deg);
          }
          100% {
            transform: rotateZ(360deg);
          }
        }

        @keyframes float-3d {
          0%,
          100% {
            transform: translateY(0px) rotateX(0deg) rotateY(0deg);
          }
          50% {
            transform: translateY(-20px) rotateX(180deg) rotateY(180deg);
          }
        }

        @keyframes pulse-3d {
          0%,
          100% {
            transform: scale(1) rotateX(0deg);
            opacity: 1;
          }
          50% {
            transform: scale(1.05) rotateX(10deg);
            opacity: 0.8;
          }
        }

        @keyframes fade-in-out {
          0%,
          100% {
            opacity: 0.7;
          }
          50% {
            opacity: 1;
          }
        }

        .animate-rotate-3d {
          animation: rotate-3d 8s linear infinite;
        }

        .animate-zoom-in-out {
          animation: zoom-in-out 12s ease-in-out infinite;
        }

        .animate-orbit-x {
          animation: orbit-x 4s linear infinite;
        }

        .animate-orbit-y {
          animation: orbit-y 6s linear infinite;
        }

        .animate-orbit-z {
          animation: orbit-z 5s linear infinite;
        }

        .animate-float-3d {
          animation: float-3d 3s ease-in-out infinite;
        }

        .animate-pulse-3d {
          animation: pulse-3d 2s ease-in-out infinite;
        }

        .animate-fade-in-out {
          animation: fade-in-out 3s ease-in-out infinite;
        }
      `}</style>

      {/* Fondo negro degradado lineal + radial sutil */}
      <div
        className="fixed inset-0 flex items-center justify-center overflow-hidden perspective-1000"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(15,15,15,0.9) 0%, rgba(5,5,5,1) 60%)',
        }}
      >
        {/* ---------- ZOOM DEL CONJUNTO ------------- */}
        <div className="animate-zoom-in-out">
          {/* ---------- CUBO GIRANDO ------------- */}
          <div className="relative preserve-3d animate-rotate-3d">
            <div className="cube-container preserve-3d">
              <div className="cube-face front  bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-600">
                <span className="text-6xl font-bold text-amber-400">G</span>
              </div>
              <div className="cube-face back   bg-gradient-to-br from-gray-800  to-black    border border-gray-600">
                <span className="text-6xl font-bold text-amber-400">A</span>
              </div>
              <div className="cube-face right  bg-gradient-to-br from-zinc-700  to-zinc-900 border border-zinc-600">
                <span className="text-6xl font-bold text-amber-400">P</span>
              </div>
              <div className="cube-face left   bg-gradient-to-br from-stone-700 to-stone-900 border border-stone-600">
                <span className="text-6xl font-bold text-amber-400">P</span>
              </div>
              <div className="cube-face top    bg-gradient-to-br from-neutral-700 to-neutral-900 border border-neutral-600">
                <span className="text-4xl font-bold text-amber-400">★</span>
              </div>
              <div className="cube-face bottom bg-gradient-to-br from-gray-700  to-gray-900 border border-gray-600">
                <span className="text-4xl font-bold text-amber-400">●</span>
              </div>
            </div>

            {/* Anillos */}
            <div className="absolute inset-0 preserve-3d animate-orbit-x">
              <div className="ring-3d border border-cyan-400 opacity-60" />
            </div>
            <div className="absolute inset-0 preserve-3d animate-orbit-y">
              <div className="ring-3d border border-yellow-400 opacity-60 rotate-90" />
            </div>
            <div className="absolute inset-0 preserve-3d animate-orbit-z">
              <div className="ring-3d border border-pink-400 opacity-60 rotate-45" />
            </div>
          </div>
        </div>

        {/* Partículas */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-float-3d opacity-70"
            style={{
              left: `${20 + i * 10}%`,
              top: `${30 + ((i + 1) % 3) * 20}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${3 + i * 0.6}s`,
            }}
          />
        ))}

        {/* Texto */}
        <div className="absolute text-center bottom-16 left-1/2 -translate-x-1/2">
          <h1 className="text-5xl font-extrabold text-white text-3d animate-pulse-3d">
            G‑APP&nbsp;3D
          </h1>
          <p className="text-gray-300 mt-2 animate-fade-in-out">
            Figura Animada Tridimensional
          </p>
        </div>

        {/* Halos de luz */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl animate-pulse" />
          <div
            className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl animate-pulse"
            style={{ animationDelay: '1s' }}
          />
        </div>
      </div>
    </>
  )
}