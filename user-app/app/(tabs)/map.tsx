import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import Constants from 'expo-constants';
import { API_BASE_URL } from '../../config';  // ✅ Use same config as login

const BUS_ID = Constants.manifest?.extra?.BUS_ID || 'BUS001';

// ✅ No hardcoded URLs now
const SERVER_URL = `${API_BASE_URL}/bus-location/${BUS_ID}`;
const ETA_URL = `${API_BASE_URL}/eta`;

export default function IndexScreen() {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [busLocation, setBusLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [eta, setEta] = useState<string | null>(null);
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

  // Fetch bus location & ETA
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

          // If we have both user & bus location, get ETA
          if (userLocation && location) {
            try {
              const etaRes = await axios.post(ETA_URL, {
                bus_lat: location.latitude,
                bus_lon: location.longitude,
                user_lat: userLocation.latitude,
                user_lon: userLocation.longitude,
              });
              if (etaRes.data?.eta) {
                setEta(etaRes.data.eta);
              }
            } catch (err) {
              console.error("Failed to fetch ETA:", err);
            }
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
  }, [userLocation]);

  const defaultRegion: Region = {
    latitude: userLocation?.latitude || 11.1271,
    longitude: userLocation?.longitude || 78.6569,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <View style={styles.container}>
      {eta && (
        <View style={styles.etaContainer}>
          <Text style={styles.etaText}>ETA: {eta}</Text>
        </View>
      )}
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
  etaContainer: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  etaText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
