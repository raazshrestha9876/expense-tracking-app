import { useEffect } from "react";
import socket from "@/utils/socket";

const useSocketManager = (isAuthenticated: boolean) => {
    console.log(isAuthenticated);
    useEffect(() => {
        if (isAuthenticated) {
            socket.connect();
            console.log("socket connected")
        }else{
            socket.disconnect();
            console.log("socket disconnected")
        }
        return () => {
            socket.off()
        };
    }, [isAuthenticated]);
}

export default useSocketManager;