
import React from 'react';
import StandardCard from '@/components/common/StandardCard';
import { StatusCardProps } from '@/types';

const StatusCard: React.FC<StatusCardProps> = ({
  title,
  value,
  icon,
  status = "info"
}) => {
  const statusToVariant = {
    success: 'success' as const,
    warning: 'warning' as const,
    danger: 'danger' as const,
    info: 'info' as const,
    neutral: 'default' as const
  };

  return (
    <StandardCard
      title={title}
      value={value}
      icon={icon}
      variant={statusToVariant[status]}
    />
  );
};

export default StatusCard;
