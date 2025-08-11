import React from "react";
import "./ScreenLoader.css"; // Asegúrate de que este CSS contenga los estilos proporcionados

interface ScreenLoaderProps {
  tip?: string; // Mensaje opcional para mostrar en el loader
}

const ScreenLoader: React.FC<ScreenLoaderProps> = ({ tip = "" }) => {
  return (
    <div className="loader_container">
      {/* Dots top */}
      <div className="dots_top">
        <div className="dot dot_item--spin-1 blue-dark"></div>
        <div className="dot dot_item--spin-2 blue-dark"></div>
        <div className="dot dot_item--spin-3 blue-dark"></div>
        <div className="dot dot_item--spin-4 blue-dark"></div>
        <div className="dot dot_item--spin-5 blue-dark"></div>
        <div className="dot dot_item--spin-6 blue-dark"></div>
        <div className="dot dot_item--spin-7 blue-dark"></div>
      </div>

      {/* Dots medium */}
      <div className="dots_medium">
        <div className="dot dot_item--1 blue-ligth"></div>
        <div className="dot dot_item--4 blue-ligth"></div>
      </div>

      {/* Dots mid-bottom */}
      <div className="dots_mid-bottom">
        <div className="dot dot_item--1 blue-ligth"></div>
        <div className="dot dot_item--2 blue-ligth"></div>
        <div className="dot dot_item--3 blue-ligth"></div>
        <div className="dot dot_item--4 blue-ligth"></div>
      </div>

      {/* Dots bottom */}
      <div className="dots_bottom">
        <div className="dot dot_item--1 blue-ligth"></div>
        <div className="dot dot_item--2 blue-ligth"></div>
      </div>

      {/* Tip message */}
      {tip && <div className="loader_text">{tip}</div>}
    </div>
  );
};

export default ScreenLoader;
