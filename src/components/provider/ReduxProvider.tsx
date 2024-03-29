"use client"
import { Provider } from "react-redux"
import React, { createContext, useContext, useEffect, useState } from 'react'
import store from "@/redux/store"
import { io } from "socket.io-client"


type ScocketContext = {
    socket: any | null
    isConnected: boolean
}

const SocketContext = createContext<ScocketContext>({
    socket: null,
    isConnected: false
})

export const useSocket = () => {
    return useContext(SocketContext)
}








const ReduxProvider = ({ children }: { children: React.ReactNode }) => {

    const [socket, setSocket] = useState(null)
    const [isConnected, setIsConneted] = useState(false)

    useEffect(() => {
        const socketinst = io.connect("http://localhost:3000", {
            path: "/api/socket/io",
        });
        socketinst.on("connect", () => {
            setIsConneted(true)
        })
        setSocket(socketinst)
        socketinst.on("disconnect", () => {
            setIsConneted(false)
        })
        return () => socketinst.disconnect()
    }, [])



    return (
        <Provider store={store}>
            <SocketContext.Provider value={{ socket, isConnected }}>

                {children}
            </SocketContext.Provider>
        </Provider>
    )
}

export default ReduxProvider