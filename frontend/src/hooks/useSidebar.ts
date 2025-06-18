import { SidebarContext } from "@/context/sidebarContext"
import { useContext } from "react"

export function useSidebar() {
  const context = useContext(SidebarContext)
  return context
}
