import { View, Text, ScrollView, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '@/providers/AuthProvider'

export default function HomeTab() {
  const { profile } = useAuth()
  const router = useRouter()

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="px-4 pt-12 pb-8">
      <Text className="text-white text-2xl font-bold">
        Hola, {profile?.displayName?.split(' ')[0] ?? 'Jugador'} 👋
      </Text>
      <Text className="text-muted mt-1 mb-6">¿Listo para jugar hoy?</Text>

      <Pressable
        onPress={() => router.push('/(tabs)/courts/')}
        className="bg-primary rounded-2xl px-5 py-4 mb-3"
      >
        <Text className="text-white font-bold text-lg">Buscar canchas</Text>
        <Text className="text-white/70 text-sm mt-0.5">Disponibilidad en tiempo real</Text>
      </Pressable>

      <Pressable
        onPress={() => router.push('/(tabs)/bookings')}
        className="bg-surface border border-border rounded-2xl px-5 py-4"
      >
        <Text className="text-white font-bold text-lg">Mis reservas</Text>
        <Text className="text-muted text-sm mt-0.5">Ver próximos partidos</Text>
      </Pressable>
    </ScrollView>
  )
}
