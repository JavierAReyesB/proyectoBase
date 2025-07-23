// "use client";

// import React from "react";
// import Image from "next/image";

// const Enhanced3DBackground: React.FC = () => {
//   const float1 = "float1 25s ease-in-out infinite";
//   const float2 = "float2 30s ease-in-out infinite";
//   const logoUrl = "/image-removebg-preview.png";

//   return (
//     <>
//       {/* ─────────── CAPA DEL FONDO (z-10) ─────────── */}
//       <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
//         {/* Fondo radial */}
//         <div
//           className="absolute inset-0"
//           style={{ background: "var(--background-radial)" }}
//         />

//         {/* Gradiente principal */}
//         <div
//           className="absolute will-change-transform"
//           style={{
//             top: "-15%",
//             left: "-15%",
//             width: "130%",
//             height: "130%",
//             animation: float1,
//             background: "var(--gradient-primary)",
//           }}
//         />

//         {/* Capa secundaria */}
//         <div
//           className="absolute inset-0 will-change-transform"
//           style={{
//             animation: float2,
//             background: "var(--gradient-secondary)",
//           }}
//         />

//         {/* Superficies diagonales */}
//         {[{ w: "160%", h: 480, y: -180, rot: -12, alpha: 0.3 },
//           { w: "150%", h: 420, y: 260, rot: -12, alpha: 0.26 },
//           { w: "150%", h: 420, y: -540, rot: -12, alpha: 0.22 }
//         ].map((b, i) => (
//           <div
//             key={i}
//             className="absolute left-1/2 will-change-transform pointer-events-none"
//             style={{
//               width: b.w,
//               height: b.h,
//               top: "50%",
//               transform: `translate(-50%, ${b.y}px) rotate(${b.rot}deg)`,
//               background: `linear-gradient(90deg,
//                 rgba(var(--surface-light),${b.alpha * 1.3}) 0%,
//                 rgba(var(--surface-medium),${b.alpha * 0.85}) 22%,
//                 rgba(var(--surface-base),${b.alpha * 0.55}) 48%,
//                 rgba(var(--surface-deep),${b.alpha * 0.35}) 72%,
//                 rgba(var(--surface-deep),0) 100%)`,
//               clipPath: "polygon(8% 0, 100% 0, 92% 100%, 0 100%)",
//               boxShadow:
//                 "0 32px 56px -14px rgba(var(--shadow-surface),.25), 0 14px 26px -10px rgba(var(--shadow-surface),.35), inset 0 0 34px rgba(255,255,255,.20)",
//             }}
//           />
//         ))}

//         {/* Esferas flotantes */}
//         {[{ size: 240, x: 80, y: 22 },
//           { size: 200, x: 18, y: 76 },
//           { size: 180, x: 62, y: 62 },
//           { size: 210, x: 30, y: 28 },
//           { size: 150, x: 88, y: 74 },
//           { size: 130, x: 50, y: 88 }
//         ].map(({ size, x, y }) => (
//           <div
//             key={`${x}-${y}-${size}`}
//             style={{
//               position: "absolute",
//               width: size,
//               height: size,
//               left: `${x}%`,
//               top: `${y}%`,
//               transform: "translate(-50%,-50%)",
//               borderRadius: "50%",
//               willChange: "transform",
//               animation: float1,
//               background: "var(--sphere-bg)",
//               boxShadow: `0 ${size * 0.12}px ${size * 0.25}px rgba(var(--shadow-glow1),.35),
//                 0 ${size * 0.08}px ${size * 0.15}px rgba(var(--shadow-glow2),.25),
//                 0 ${size * 0.04}px ${size * 0.08}px rgba(var(--shadow-glow3),.20)`,
//             }}
//           />
//         ))}
//       </div>

//       {/* ─────────── CAPA DEL LOGO (z 10) ─────────── */}
//       <div
//         className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none"
//         style={{ animation: float1 }}
//       >
//         <Image
//           src={logoUrl}
//           alt="Logo"
//           width={740}
//           height={440}
//           priority
//           style={{ opacity: 0.2 }}
//         />
//       </div>
//     </>
//   );
// };

// export default Enhanced3DBackground;



"use client";

import React from "react";
import Image from "next/image";

const BannerBackground: React.FC = () => {
  return (
    <>
      {/* ─────────── CAPA DEL FONDO (z‑10) ─────────── */}
      <div className="fixed inset-0 -z-10">
        {/* Imagen de fondo */}
        <Image
          src="/fondo-vector-onda-degradado-abstracto-azul_53876-111548.jpg"  // ⇠ coloca aquí tu banner
          alt="Fondo con ondas fluidas"
          fill           // ocupa todo el viewport
          priority       // precarga
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* ─────────── CAPA DEL LOGO (z 10) ─────────── */}
      <div className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none">
        <Image
          src="/image-removebg-preview.png"         // tu logo existente
          alt="Logo"
          width={740}
          height={440}
          priority
          style={{ opacity: 0.2 }}
        />
      </div>
    </>
  );
};

export default BannerBackground;
