import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, Image, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import Constants from 'expo-constants';

const BUS_ID = Constants.manifest?.extra?.BUS_ID || 'BUS001';
const SERVER_URL = `https://tracker-bpkz.onrender.com/bus-location/${BUS_ID}`;

export default function IndexScreen() {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [busLocation, setBusLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const mapRef = useRef<MapView | null>(null);

  // Get user location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  // Fetch bus location
  useEffect(() => {
    let isMounted = true;
    const fetchLocation = async () => {
      try {
        const response = await axios.get(SERVER_URL);
        const { lat, lon } = response.data;
        if (lat && lon) {
          const location = { latitude: lat, longitude: lon };
          if (isMounted) {
            setBusLocation(location);
            mapRef.current?.animateToRegion({ ...location, latitudeDelta: 0.05, longitudeDelta: 0.05 }, 1000);
          }
        }
      } catch (error) {
        setErrorMsg("Failed to fetch bus location");
        console.error(error);
      }
    };

    const interval = setInterval(fetchLocation, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const defaultRegion: Region = {
    latitude: userLocation?.latitude || 11.1271,
    longitude: userLocation?.longitude || 78.6569,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <View style={styles.container}>
      {errorMsg && <Text>{errorMsg}</Text>}
      <MapView
        ref={(ref) => { mapRef.current = ref; }}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={defaultRegion}
      >
        {userLocation && (
          <Marker coordinate={userLocation} title="You">
            <Image source={require('../../assets/images/user-location.png')} style={{ width: 40, height: 40, resizeMode: 'contain' }} />
          </Marker>
        )}
        {busLocation && (
          <Marker coordinate={busLocation} title="Bus">
            <Image source={require('../../assets/images/bus.png')} style={{ width: 20, height: 20, resizeMode: 'contain' }} />
          </Marker>
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});