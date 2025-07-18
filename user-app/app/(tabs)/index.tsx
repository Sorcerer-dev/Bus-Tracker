import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';

type BusLocation = {
  lat: number;
  lon: number;
  timestamp: string;
};

export default function HomeScreen() {
  const [busLocation, setBusLocation] = useState<BusLocation | null>(null);

  useEffect(() => {
    const fetchBusLocation = async () => {
      try {
        const res = await axios.get<BusLocation>('http://192.168.67.43:5000/bus-location/BUS001');
        console.log("Bus data:", res.data);
        setBusLocation(res.data);
      } catch (error) {
        console.error("Error fetching bus location:", error);
      }
    };

    fetchBusLocation();
    const interval = setInterval(fetchBusLocation, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 18.52,
          longitude: 73.85,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {busLocation?.lat != null && busLocation?.lon != null && (
          <Marker
            coordinate={{
              latitude: busLocation.lat,
              longitude: busLocation.lon,
            }}
            title="Bus Location"
            description={`Last updated: ${new Date(busLocation.timestamp).toLocaleTimeString()}`}
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
