
import React from "react";
import StandardCard from "@/components/common/StandardCard";

interface ModernKpiCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  trend?: "up" | "down" | null;
  trendValue?: number;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
  onClick?: () => void;
}

const ModernKpiCard: React.FC<ModernKpiCardProps> = ({
  title,
  value,
  icon,
  variant = 'info',
  className,
  onClick
}) => {
  return (
    <StandardCard
      title={title}
      value={value}
      icon={icon}
      variant={variant}
      className={className}
      onClick={onClick}
    />
  );
};

export default ModernKpiCard;
