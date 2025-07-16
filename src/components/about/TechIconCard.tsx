import React from "react";
import { IconType } from "react-icons";
import { cn } from "@/lib/utils";

/**
 * Props:
 * - icon: o componente icone React vindo do react-icons
 * - name: nome visível da tecnologia
 * - url: site para redirect
 * - bg: classes de cor do círculo
 */
interface TechIconCardProps {
  icon: IconType;
  name: string;
  url: string;
  bg?: string;
  gradient?: boolean;
  extra?: React.ReactNode;
}

// Mantém tipo de fundo azul-$ para todos os cards, customizável via bg prop
const TechIconCard: React.FC<TechIconCardProps> = ({
  icon: Icon,
  name,
  url,
  bg = "bg-[#161f33]",
  gradient,
  extra
}) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className={cn(
      "group w-[140px] h-[140px] md:w-[155px] md:h-[155px] rounded-2xl flex flex-col items-center justify-center text-center px-2 py-4 bg-transparent hover:scale-105 transition-all shadow-none ring-0 focus-ring-premium border-0",
      "card-hover-effect"
    )}
    style={{ boxShadow: "0 0 0 1.5px #1d263a, 0 8px 36px 0 rgba(36,46,68,0.40)" }}
  >
    <div className={cn(
      "flex items-center justify-center rounded-full", bg,
      "w-[64px] h-[64px] md:w-[72px] md:h-[72px] mb-3 shadow-custom"
    )}>
      <Icon size={44} className="text-blue-400 drop-shadow-lg transition duration-500" />
    </div>
    <span className="font-bold text-blue-100 text-base md:text-lg tracking-tight mt-1">
      {name}
    </span>
    {extra}
  </a>
);

export default TechIconCard;
