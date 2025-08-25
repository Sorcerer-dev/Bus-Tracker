import { View, Text, TextInput, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function LoginScreen() {
  const router = useRouter();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    router.replace('/(tabs)/home');
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Login</Text>
      
      <TextInput
        placeholder="ID"
        value={id}
        onChangeText={setId}
        style={{
          borderWidth: 1,
          borderColor: '#007AFF', // blue border
          backgroundColor: '#E6F0FF', // light blue background
          color: '#000', // text color
          padding: 10,
          borderRadius: 8,
          marginBottom: 15
        }}
      />
      
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{
          borderWidth: 1,
          borderColor: '#249836ff',
          backgroundColor: '#b29319ff',
          color: '#000',
          padding: 10,
          borderRadius: 8,
          marginBottom: 20
        }}
      />
      
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}
