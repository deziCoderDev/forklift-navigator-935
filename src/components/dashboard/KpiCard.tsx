
import React from "react";
import StandardCard from "@/components/common/StandardCard";

interface KpiCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  onClick?: () => void;
  className?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  icon,
  variant = 'info',
  onClick,
  className,
}) => (
  <StandardCard
    title={title}
    value={value}
    icon={icon}
    variant={variant}
    onClick={onClick}
    className={className}
  />
);

export default KpiCard;
