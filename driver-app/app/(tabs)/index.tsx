import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import Constants from 'expo-constants';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';

const BUS_ID = Constants.manifest?.extra?.BUS_ID || 'BUS001';
const SERVER_URL = 'https://tracker-bpkz.onrender.com/location';
const TASK_NAME = 'BACKGROUND_LOCATION_TASK';

TaskManager.defineTask(TASK_NAME, async () => {
  try {
    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    await axios.post(SERVER_URL, {
      bus_id: BUS_ID,
      lat: latitude,
      lon: longitude,
      timestamp: new Date().toISOString(),
    });
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error('Background task error:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export default function App() {
  const [isTracking, setIsTracking] = useState(false);

  const toggleTracking = async () => {
    if (isTracking) {
      await Location.stopLocationUpdatesAsync(TASK_NAME);
      setIsTracking(false);
    } else {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required.');
        return;
      }
      await Location.startLocationUpdatesAsync(TASK_NAME, {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 10,
        foregroundService: {
          notificationTitle: 'Tracking Bus Location',
          notificationBody: 'Your bus location is being shared.',
        },
      });
      setIsTracking(true);
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
