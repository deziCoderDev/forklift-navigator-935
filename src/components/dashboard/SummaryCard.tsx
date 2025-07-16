
import React from "react";
import StandardCard from "@/components/common/StandardCard";

interface SummaryCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
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

export default SummaryCard;
