import { useEffect, useState } from 'react'
import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import apiClient from '@/lib/api-client'
import type { Court } from '@pitch-pass/types'

export default function CourtsTab() {
  const [courts, setCourts] = useState<Court[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    apiClient.get('/courts')
      .then(({ data }) => setCourts(data.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator color="#22c55e" />
      </View>
    )
  }

  return (
    <View className="flex-1 bg-background">
      <Text className="text-white text-2xl font-bold px-4 pt-12 pb-4">Canchas</Text>
      <FlatList
        data={courts}
        keyExtractor={(c) => c.id}
        contentContainerClassName="px-4 pb-8"
        ItemSeparatorComponent={() => <View className="h-3" />}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/(tabs)/courts/${item.id}`)}
            className="bg-surface border border-border rounded-2xl p-4"
          >
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <Text className="text-white font-semibold text-base">{item.name}</Text>
                <Text className="text-muted text-sm mt-0.5">{item.city}</Text>
              </View>
              <Text className="text-primary font-bold">${item.pricePerHour}/h</Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={<Text className="text-muted text-center mt-8">No hay canchas disponibles.</Text>}
      />
    </View>
  )
}
