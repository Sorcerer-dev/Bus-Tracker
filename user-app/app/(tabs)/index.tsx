import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';

export default function IndexScreen() {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [busLocation, setBusLocation] = useState<{ latitude: number; longitude: number }>({
    latitude: 11.0168,
    longitude: 76.9558,
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const mapRef = useRef<MapView | null>(null);

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

  // Simulate moving bus
  useEffect(() => {
    const interval = setInterval(() => {
      setBusLocation((prev) => {
        const newLocation = {
          latitude: prev.latitude + 0.001,
          longitude: prev.longitude + 0.001,
        };

        // Optional: animate camera to bus
        mapRef.current?.animateToRegion({
          latitude: newLocation.latitude,
          longitude: newLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }, 1000);

        return newLocation;
      });
    }, 2000);

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
        ref={(ref) => (mapRef.current = ref)}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={defaultRegion}
      >
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="You"
            pinColor="blue"
          />
        )}
        <Marker
          coordinate={busLocation}
          title="Bus (Simulated)"
          pinColor="red"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
