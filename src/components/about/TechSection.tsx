
import React from "react";
import TechIconCard from "./TechIconCard";

interface TechItem {
  name: string;
  icon: any;
  url: string;
  bg?: string;
  gradient?: boolean;
  extra?: React.ReactNode;
}

interface TechSectionProps {
  title: string;
  items: TechItem[];
}

const TechSection: React.FC<TechSectionProps> = ({ title, items }) => {
  return (
    <div>
      <h3 className="text-2xl font-extrabold mb-6 flex items-center gap-3 gradient-text drop-shadow-sm">
        {title}
      </h3>
      <div className="w-full grid place-items-center gap-y-6 gap-x-4 
        grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 
        xl:grid-cols-5 2xl:grid-cols-6">
        {items.map((item) => (
          <TechIconCard
            key={item.name}
            icon={item.icon}
            name={item.name}
            url={item.url}
            bg={item.bg}
            gradient={item.gradient}
            extra={item.extra}
          />
        ))}
      </div>
    </div>
  );
};

export default TechSection;

