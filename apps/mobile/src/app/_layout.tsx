import { Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { AuthProvider } from '@/providers/AuthProvider'
import { SocketProvider } from '@/providers/SocketProvider'

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <SocketProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </SocketProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  )
}
