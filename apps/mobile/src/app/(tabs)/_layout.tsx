import { Tabs } from 'expo-router'
import { Text } from 'react-native'

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#111118',
          borderTopColor: '#2a2a38',
        },
        tabBarActiveTintColor: '#22c55e',
        tabBarInactiveTintColor: '#64748b',
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Inicio', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🏠</Text> }} />
      <Tabs.Screen name="courts/index" options={{ title: 'Canchas', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📍</Text> }} />
      <Tabs.Screen name="bookings" options={{ title: 'Reservas', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📅</Text> }} />
      <Tabs.Screen name="profile" options={{ title: 'Perfil', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>👤</Text> }} />
    </Tabs>
  )
}
