import { useEffect, useState } from 'react'
import { View, Text, FlatList, ActivityIndicator } from 'react-native'
import apiClient from '@/lib/api-client'
import type { Booking } from '@pitch-pass/types'

export default function BookingsTab() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient.get('/bookings/mine')
      .then(({ data }) => setBookings(data.data))
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
      <Text className="text-white text-2xl font-bold px-4 pt-12 pb-4">Mis reservas</Text>
      <FlatList
        data={bookings}
        keyExtractor={(b) => b.id}
        contentContainerClassName="px-4 pb-8"
        ItemSeparatorComponent={() => <View className="h-3" />}
        renderItem={({ item }) => (
          <View className="bg-surface border border-border rounded-2xl p-4">
            <View className="flex-row justify-between">
              <Text className="text-white font-medium">Reserva #{item.id.slice(-6)}</Text>
              <Text className={`text-sm font-medium ${item.status === 'CONFIRMED' ? 'text-primary' : 'text-muted'}`}>
                {item.status}
              </Text>
            </View>
            <Text className="text-muted text-sm mt-1">Total: ${item.totalAmount}</Text>
          </View>
        )}
        ListEmptyComponent={<Text className="text-muted text-center mt-8">No tenés reservas aún.</Text>}
      />
    </View>
  )
}
