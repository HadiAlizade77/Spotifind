import { AuthChangeEvent } from "@supabase/supabase-js"
import { createContext } from "react"
export default createContext<AuthChangeEvent | null>(null)