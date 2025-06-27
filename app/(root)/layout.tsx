import Navbar from "@/components/Navbar"
import { ReactNode } from "react"

const layout = ({children}: {children: React.ReactNode }) => {
  return (
    <div>
      <Navbar/>
      {children}
    </div>
  )
}

export default layout
