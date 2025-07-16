
import { useEffect } from 'react';
import { useAppStore } from '@/stores/useAppStore';

export const useRealTimeSync = () => {
  const lastUpdate = useAppStore((state) => state.lastUpdate);
  const recalculateMetrics = useAppStore((state) => state.recalculateMetrics);
  const generateAlerts = useAppStore((state) => state.generateAlerts);

  useEffect(() => {
    // Recalcula métricas e alertas sempre que há uma atualização
    recalculateMetrics();
    generateAlerts();
    
    console.log('🔄 Dados sincronizados em tempo real:', new Date(lastUpdate).toLocaleTimeString());
  }, [lastUpdate, recalculateMetrics, generateAlerts]);

  return { lastUpdate };
};
