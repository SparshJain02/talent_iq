import {useMutation, useQuery} from "@tanstack/react-query"
import { sessionApi } from "../api/session.js"
import toast from "react-hot-toast"

export const useCreateSession = ()=>{
    const result = useMutation({
        mutationKey: ["createsession"],
        mutationFn: sessionApi.createSession,
        onSuccess: ()=> toast.success("Session Created!"),
        onError: (error)=> toast.error( error?.data||"Failed to create room")
    })
    return result;
}
export const useActiveSessions = ()=>{
    const result = useQuery({
        queryKey: ["activesessions"],
        queryFn: sessionApi.getActiveSessions,
        refetchInterval: 3000
    })
    return result;
}
export const useMyRecentSessions = ()=>{
    const result = useQuery({
        queryKey: ["recentsessions"],
        queryFn: sessionApi.getMyRecentSessions
    })
    return result;
}
export const useSessionById = (id)=>{
    const result = useQuery({
        queryKey: ["session",id],
        queryFn: ()=>sessionApi.getSessionById(id),
        enabled: !!id,
        refetchInterval: 5000 // refetch in every 5 seconds
    });
    return result;
}

export const useEndSession = ()=>{
    const result = useMutation({
        mutationKey: ["endsession"],
        mutationFn: sessionApi.endSession,
        onSuccess: ()=> toast.success("Session Ended Successfully"),
        onError: ()=> toast.error("Error ending session!")
    })
    return result;
}

export const useJoinSession = ()=>{
    const result = useMutation({
        mutationKey: ["joinsession"],
        mutationFn:  sessionApi.joinSession,
        onSuccess:()=> toast.success("joined successfully"),
        onError: (error)=> toast.error(error?.message || "Failed to join session"),
    })
    return result;
}