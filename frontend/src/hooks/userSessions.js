import {useMutation, useQuery} from "@tanstack/react-query"
import { sessionApi } from "../api/session.js"
import toast from "react-hot-toast"

export const useCreateSession = ()=>{
    const result = useMutation({
        mutationKey: ["createSession"],
        mutationFn: sessionApi.createSession,
        onSuccess: ()=> toast.success("Session Created!"),
        onError: (error)=> toast.error( error?.data||"Failed to create room")
    })
    return result;
}
export const useActiveSessions = ()=>{
    const result = useQuery({
        queryKey: ["activeSessions"],
        queryFn: sessionApi.getActiveSessions
    })
    return result;
}
export const useMyRecentSessions = ()=>{
    const result = useQuery({
        queryKey: ["recentSessions"],
        queryFn: sessionApi.getMyRecentSessions
    })
    return result;
}