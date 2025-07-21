import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';

export default function App() {
  const [isTracking, setIsTracking] = useState(false);
  const [locationWatcher, setLocationWatcher] = useState<Location.LocationSubscription | null>(null);

  const startTracking = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required.');
      return;
    }

    const watcher = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 },
      (loc) => {
        if (loc?.coords) {
          sendLocationToServer(loc.coords.latitude, loc.coords.longitude);
        }
      }
    );

    setLocationWatcher(watcher);
    setIsTracking(true);
  };

  const stopTracking = () => {
    locationWatcher?.remove();
    setLocationWatcher(null);
    setIsTracking(false);
  };

  const toggleTracking = () => {
    isTracking ? stopTracking() : startTracking();
  };

  const sendLocationToServer = async (lat: number, lon: number) => {
    try {
      await axios.post('http://192.168.67.43:5000/location', {
        bus_id: 'BUS001',
        lat,
        lon,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error sending location:', error.message);
      } else {
        console.error('Unknown error sending location');
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isTracking ? styles.stopButton : styles.startButton]}
        onPress={toggleTracking}
      >
        <Text style={styles.buttonText}>
          {isTracking ? 'Stop Tracking' : 'Start Tracking'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  button: { paddingVertical: 15, paddingHorizontal: 30, borderRadius: 10 },
  startButton: { backgroundColor: 'red' },
  stopButton: { backgroundColor: 'green' },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});
