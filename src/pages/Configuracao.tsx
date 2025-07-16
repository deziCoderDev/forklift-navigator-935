import React from "react";
import { Github, Cog } from "lucide-react";
import { Button } from "@/components/ui/button";

// Importando ícones oficiais das tecnologias
import { 
  SiReact, 
  SiTypescript, 
  SiTailwindcss, 
  SiVite, 
  SiLucide, 
  SiRadixui 
} from "react-icons/si";

const techs = [
  { name: "React", icon: SiReact, iconColor: "#149eca" },
  { name: "TypeScript", icon: SiTypescript, iconColor: "#3178c6" },
  { name: "Tailwind CSS", icon: SiTailwindcss, iconColor: "#38bdf8" },
  { name: "Vite", icon: SiVite, iconColor: "#646cff" },
  { name: "Lucide", icon: SiLucide, iconColor: "#ea580c" },
  { name: "Radix UI", icon: SiRadixui, iconColor: "#00c790" },
];

export default function Configuracao() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-7 py-8 px-2">
      {/* Sobre o Sistema */}
      <section className="rounded-xl border border-slate-600/40 bg-card/80 p-6 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <Cog className="w-5 h-5 opacity-80" />
          <span className="font-semibold text-lg">Sobre o Sistema</span>
        </div>
        <div className="space-y-1 pl-1 text-sm">
          <div>
            <span className="text-slate-400">Descrição:</span>
            <br />
            <span>
              Plataforma para gestão de empilhadeiras, operadores, operações, abastecimento e manutenção em tempo real, focada em produtividade e usabilidade.
            </span>
          </div>
        </div>
      </section>

      {/* Botão centralizado */}
      <section className="rounded-xl border border-slate-600/40 bg-card/80 p-6 shadow-md flex justify-center">
        <Button
          asChild
          className="bg-muted text-foreground font-semibold shadow transition-colors hover:bg-muted/80"
        >
          <a
            href="https://github.com/olucasmf"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="w-5 h-5 mr-2" /> Profile DEV
          </a>
        </Button>
      </section>

      {/* Tecnologias */}
      <section className="rounded-xl border border-slate-600/40 bg-card/80 p-6 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <span className="font-semibold text-lg">Principais Tecnologias</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {techs.map(({ name, icon: Icon, iconColor }) => (
            <div
              key={name}
              className="flex flex-col items-center justify-center bg-slate-800/90 rounded-lg p-4 min-h-[90px] transition border border-slate-700/50"
            >
              <Icon className="w-8 h-8 mb-2" color={iconColor} />
              <span className="text-blue-100 text-[13px] font-semibold text-center">{name}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
