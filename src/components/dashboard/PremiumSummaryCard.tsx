
import React from "react";
import StandardCard from "@/components/common/StandardCard";

interface PremiumSummaryCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  info?: string;
  className?: string;
  onClick?: () => void;
}

const PremiumSummaryCard: React.FC<PremiumSummaryCardProps> = ({
  title,
  value,
  icon,
  variant = 'info',
  className,
  onClick,
}) => (
  <StandardCard
    title={title}
    value={value}
    icon={icon}
    variant={variant}
    className={className}
    onClick={onClick}
  />
);

export default PremiumSummaryCard;
