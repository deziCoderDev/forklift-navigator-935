
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type SidebarState = 'expanded' | 'collapsed';

interface SidebarContextValue {
  state: SidebarState;
  toggle: () => void;
  setState: (s: SidebarState) => void;
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

export function useSidebarGlobal() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("SidebarContext not in provider");
  return ctx;
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SidebarState>(() =>
    (typeof window !== "undefined" && localStorage.getItem('sidebarState')) === 'collapsed'
      ? 'collapsed'
      : 'expanded'
  );

  useEffect(() => {
    localStorage.setItem('sidebarState', state);
  }, [state]);

  const toggle = () => setState(s => s === 'expanded' ? 'collapsed' : 'expanded');

  return (
    <SidebarContext.Provider value={{ state, setState, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
}
