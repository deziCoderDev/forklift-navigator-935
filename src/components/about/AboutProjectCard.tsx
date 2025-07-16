
import React from "react";
import { BsStars } from "react-icons/bs";
import { FaGithub } from "react-icons/fa";

const AboutProjectCard: React.FC = () => {
  return (
    <div
      className="
        relative overflow-hidden rounded-2xl w-full
        max-w-md mx-auto
        shadow-lg border-0 glass-card animate-fade-in
        sm:px-0 px-2
      "
      style={{
        minHeight: "340px",
      }}
    >
      {/* Animated Gradient Glow */}
      <div
        className="
          pointer-events-none absolute -inset-2 z-0 opacity-70 blur-2xl
          [mask-image:radial-gradient(white,transparent_85%)]
        "
      >
        <div className="animate-[spin_12s_linear_infinite] w-full h-full bg-gradient-to-tr from-indigo-500/50 via-purple-400/40 to-pink-400/40" />
      </div>

      {/* Card Content */}
      <div className="relative z-10 flex flex-col items-center text-center p-6 sm:py-10 sm:px-8 gap-5 w-full">
        <span className="mb-2 flex items-center justify-center animate-float">
          <BsStars className="w-11 h-11 text-purple-400 drop-shadow-glow animate-pulse-glow" />
        </span>
        <h3 className="text-[1.6rem] md:text-2xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-orange-400 bg-clip-text text-transparent mb-2 drop-shadow-sm">
          Sobre o Projeto
        </h3>
        <p className="text-muted-foreground text-base md:text-lg font-medium mb-2 max-w-xs sm:max-w-sm md:max-w-none">
          Projeto feito sem fins de implementação real para funcionamento. Foi apenas um projeto para brincar com a IA e testar a real capacidade da IA.
        </p>
        <a
          href="https://github.com/olucasmf"
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-flex items-center justify-center gap-2 rounded-lg
            px-4 py-2 mt-2
            bg-gradient-to-r from-slate-800/85 to-blue-900/80
            text-blue-300 hover:bg-gradient-to-tr hover:from-blue-600 hover:to-indigo-600
            border border-slate-700 hover:shadow-2xl
            transition-all duration-300 text-sm font-semibold
            focus-ring-premium shadow-md backdrop-blur-md
            w-full max-w-xs sm:max-w-xs md:max-w-[220px]
          "
        >
          <FaGithub className="w-5 h-5 animate-float" />
          github.com/olucasmf
        </a>
      </div>
    </div>
  );
};

export default AboutProjectCard;
