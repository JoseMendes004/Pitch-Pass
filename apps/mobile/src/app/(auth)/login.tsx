import { useState } from 'react'
import { View, Text, TextInput, Pressable, Alert } from 'react-native'
import auth from '@react-native-firebase/auth'
import apiClient from '@/lib/api-client'
import { useRouter, Link } from 'expo-router'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    setLoading(true)
    try {
      const { user } = await auth().signInWithEmailAndPassword(email, password)
      const idToken = await user.getIdToken()
      await apiClient.post('/auth/verify', { idToken })
      router.replace('/(tabs)/')
    } catch {
      Alert.alert('Error', 'Email o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="flex-1 bg-background px-6 justify-center">
      <Text className="text-primary text-2xl font-bold mb-8">Pitch Pass</Text>

      <Text className="text-white text-xl font-bold mb-6">Iniciar sesión</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor="#64748b"
        keyboardType="email-address"
        autoCapitalize="none"
        className="bg-surface-2 border border-border rounded-xl px-4 py-3.5 text-white mb-3"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Contraseña"
        placeholderTextColor="#64748b"
        secureTextEntry
        className="bg-surface-2 border border-border rounded-xl px-4 py-3.5 text-white mb-6"
      />

      <Pressable
        onPress={handleLogin}
        disabled={loading}
        className="bg-primary rounded-xl py-4 items-center mb-4"
      >
        <Text className="text-white font-semibold text-base">
          {loading ? 'Ingresando...' : 'Ingresar'}
        </Text>
      </Pressable>

      <Link href="/(auth)/register" className="text-center text-muted text-sm">
        ¿No tenés cuenta? <Text className="text-primary">Registrarse</Text>
      </Link>
    </View>
  )
}
