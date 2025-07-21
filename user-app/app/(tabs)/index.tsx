import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';

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

  // Fetch bus location every 3s
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await axios.get('http://192.168.67.43:5000/bus-location/BUS001');
        const { latitude, lat, longitude, lon } = response.data;

        const busLat = latitude ?? lat;
        const busLon = longitude ?? lon;

        if (busLat && busLon) {
          const location = { latitude: busLat, longitude: busLon };
          setBusLocation(location);
          mapRef.current?.animateToRegion({ ...location, latitudeDelta: 0.05, longitudeDelta: 0.05 }, 1000);
        } else {
          console.warn("No coordinates found in bus location");
        }
      } catch (error) {
        console.error('Error fetching bus location:', error);
      }
    }, 3000);

    return () => clearInterval(interval);
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
              <Image
                source={require('../../assets/images/user-location.png')}  // Your selected icon
                style={{ width: 40, height: 40, resizeMode: 'contain' }}
              />
            </Marker>
        )}
        {busLocation && (
            <Marker coordinate={busLocation} title="Bus">
              <Image
                source={require('../../assets/images/bus.png')}
                style={{ width: 20, height: 20, resizeMode: 'contain' }}
              />
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
