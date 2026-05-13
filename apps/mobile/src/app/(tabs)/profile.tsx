import { View, Text, Pressable } from 'react-native'
import { useAuth } from '@/providers/AuthProvider'
import { useRouter } from 'expo-router'

export default function ProfileTab() {
  const { profile, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.replace('/(auth)/login')
  }

  return (
    <View className="flex-1 bg-background px-4 pt-12">
      <Text className="text-white text-2xl font-bold mb-6">Perfil</Text>

      <View className="bg-surface border border-border rounded-2xl p-4 mb-4">
        <Text className="text-white font-semibold text-lg">{profile?.displayName}</Text>
        <Text className="text-muted text-sm mt-0.5">{profile?.email}</Text>
        <View className="mt-2">
          <Text className="text-xs text-primary font-medium uppercase tracking-wider">
            {profile?.role === 'PLAYER' ? 'Jugador' : profile?.role === 'OWNER' ? 'Dueño de cancha' : 'Admin'}
          </Text>
        </View>
      </View>

      <Pressable onPress={handleLogout} className="bg-danger/10 border border-danger/30 rounded-2xl py-4 items-center">
        <Text className="text-danger font-semibold">Cerrar sesión</Text>
      </Pressable>
    </View>
  )
}
