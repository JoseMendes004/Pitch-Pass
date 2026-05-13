import { useEffect } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '@/providers/AuthProvider'

export default function Index() {
  const { profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (profile) {
      router.replace('/(tabs)/')
    } else {
      router.replace('/(auth)/login')
    }
  }, [loading, profile])

  return (
    <View className="flex-1 bg-background items-center justify-center">
      <ActivityIndicator color="#22c55e" />
    </View>
  )
}
