import { createContext, useContext, useEffect, useRef, ReactNode } from 'react'
import { io, Socket } from 'socket.io-client'
import auth from '@react-native-firebase/auth'
import type { ServerToClientEvents, ClientToServerEvents } from '@pitch-pass/types'

type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>

const SocketContext = createContext<AppSocket | null>(null)

export function SocketProvider({ children }: { children: ReactNode }) {
  const socketRef = useRef<AppSocket | null>(null)
  const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL ?? 'http://localhost:3001'

  useEffect(() => {
    const unsub = auth().onAuthStateChanged(async (user) => {
      socketRef.current?.disconnect()
      if (user) {
        const token = await user.getIdToken()
        socketRef.current = io(`${SOCKET_URL}/bookings`, {
          auth: { token },
          transports: ['websocket'],
        }) as AppSocket
      }
    })
    return () => {
      unsub()
      socketRef.current?.disconnect()
    }
  }, [])

  return <SocketContext.Provider value={socketRef.current}>{children}</SocketContext.Provider>
}

export function useSocket() {
  return useContext(SocketContext)
}
