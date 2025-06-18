"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type SidebarContextType = {
  isOpen: boolean
  toggle: () => void;
}

export const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => {
    setIsOpen((prev) => !prev);
  }

  return <SidebarContext.Provider value={{ isOpen, toggle }}>{children}</SidebarContext.Provider>
}

