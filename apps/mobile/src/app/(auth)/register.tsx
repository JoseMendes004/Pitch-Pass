import { useState } from 'react'
import { View, Text, TextInput, Pressable, Alert } from 'react-native'
import auth from '@react-native-firebase/auth'
import apiClient from '@/lib/api-client'
import { useRouter, Link } from 'expo-router'

export default function RegisterScreen() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'PLAYER' })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async () => {
    setLoading(true)
    try {
      const { user } = await auth().createUserWithEmailAndPassword(form.email, form.password)
      await user.updateProfile({ displayName: form.name })
      const idToken = await user.getIdToken()
      await apiClient.post('/auth/verify', { idToken, role: form.role })
      router.replace('/(tabs)/')
    } catch {
      Alert.alert('Error', 'No se pudo crear la cuenta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="flex-1 bg-background px-6 justify-center">
      <Text className="text-primary text-2xl font-bold mb-8">Pitch Pass</Text>
      <Text className="text-white text-xl font-bold mb-6">Crear cuenta</Text>

      {[
        { key: 'name', placeholder: 'Nombre completo' },
        { key: 'email', placeholder: 'Email', keyboardType: 'email-address' as const },
        { key: 'password', placeholder: 'Contraseña (mín. 6)', secureTextEntry: true },
      ].map(({ key, placeholder, keyboardType, secureTextEntry }) => (
        <TextInput
          key={key}
          value={(form as any)[key]}
          onChangeText={(v) => setForm({ ...form, [key]: v })}
          placeholder={placeholder}
          placeholderTextColor="#64748b"
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          className="bg-surface-2 border border-border rounded-xl px-4 py-3.5 text-white mb-3"
        />
      ))}

      <View className="flex-row gap-3 mb-6">
        {(['PLAYER', 'OWNER'] as const).map((r) => (
          <Pressable
            key={r}
            onPress={() => setForm({ ...form, role: r })}
            className={`flex-1 py-3 rounded-xl border items-center ${
              form.role === r ? 'border-primary bg-primary/10' : 'border-border bg-surface-2'
            }`}
          >
            <Text className={form.role === r ? 'text-primary font-semibold' : 'text-muted'}>
              {r === 'PLAYER' ? 'Jugador' : 'Dueño'}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable onPress={handleRegister} disabled={loading} className="bg-primary rounded-xl py-4 items-center mb-4">
        <Text className="text-white font-semibold text-base">
          {loading ? 'Creando...' : 'Crear cuenta'}
        </Text>
      </Pressable>

      <Link href="/(auth)/login" className="text-center text-muted text-sm">
        ¿Ya tenés cuenta? <Text className="text-primary">Iniciar sesión</Text>
      </Link>
    </View>
  )
}
