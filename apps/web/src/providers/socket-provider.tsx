'use client'

import { createContext, useContext, useEffect, useRef, ReactNode } from 'react'
import { io, Socket } from 'socket.io-client'
import type { ServerToClientEvents, ClientToServerEvents } from '@pitch-pass/types'
import { useAuth } from './auth-provider'

type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>

const SocketContext = createContext<AppSocket | null>(null)

export function SocketProvider({ children }: { children: ReactNode }) {
  const { firebaseUser } = useAuth()
  const socketRef = useRef<AppSocket | null>(null)

  useEffect(() => {
    if (!firebaseUser) {
      socketRef.current?.disconnect()
      socketRef.current = null
      return
    }

    firebaseUser.getIdToken().then((token) => {
      socketRef.current = io(
        (process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:3001') + '/bookings',
        {
          auth: { token },
          transports: ['websocket'],
          reconnectionAttempts: 3,
          reconnectionDelay: 2000,
        },
      ) as AppSocket
    })

    return () => {
      socketRef.current?.disconnect()
    }
  }, [firebaseUser])

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket() {
  return useContext(SocketContext)
}
