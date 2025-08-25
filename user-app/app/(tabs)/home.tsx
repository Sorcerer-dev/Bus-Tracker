import { View, Text, Image, Button, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from "../../config";

export default function HomeScreen() {
  const router = useRouter();
  const [serverOnline, setServerOnline] = useState(false);
  const userName = "Atharv"; // later from login

  useEffect(() => {
    const checkServer = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/ping`);
        if (res.status === 200) {
          setServerOnline(true);
        }
      } catch (error) {
        setServerOnline(false);
      }
    };

    checkServer();
    const interval = setInterval(checkServer, 5000); // Check every 5 seconds
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* Top Row */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Name + Go to Profile Button */}
        <View>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{userName}</Text>
          <TouchableOpacity onPress={() => router.push('/profile')}>
            <Text style={{ color: "#007AFF", fontSize: 14 }}>Go to Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Picture */}
        <Image 
          source={{ uri: 'https://via.placeholder.com/40' }} 
          style={{ width: 50, height: 50, borderRadius: 25 }} 
        />
      </View>

      {/* Center Section */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 16, color: serverOnline ? "green" : "red", marginBottom: 20 }}>
          {serverOnline ? "🟢 Online" : "🔴 Offline"}
        </Text>

        {serverOnline ? (
          <Button 
            title="View Bus Location" 
            onPress={() => router.push('/map')} 
            color="#007AFF"
          />
        ) : (
          <Text style={{ fontSize: 16, color: "gray" }}>Details not available</Text>
        )}
      </View>
    </View>
  );
}
