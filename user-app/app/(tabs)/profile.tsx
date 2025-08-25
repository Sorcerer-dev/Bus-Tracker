import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const [routeNumber, setRouteNumber] = useState('101');
  const [stopName, setStopName] = useState('Central Station');
  const [busId, setBusId] = useState('BUS-456');
  const [isEditing, setIsEditing] = useState(false);

  return (
    <View style={{ padding: 20 }}>
      {/* Route Number */}
      <Text style={styles.label}>Bus Route Number</Text>
      <TextInput
        style={styles.inputBox}
        value={routeNumber}
        onChangeText={setRouteNumber}
        editable={isEditing}
      />

      {/* Stop Name */}
      <Text style={styles.label}>Stop Name</Text>
      <TextInput
        style={styles.inputBox}
        value={stopName}
        onChangeText={setStopName}
        editable={isEditing}
      />

      {/* Bus ID */}
      <Text style={styles.label}>Bus ID</Text>
      <TextInput
        style={styles.inputBox}
        value={busId}
        onChangeText={setBusId}
        editable={isEditing}
      />

      {/* Edit Icon */}
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => setIsEditing(!isEditing)}
      >
        <Ionicons
          name={isEditing ? 'checkmark' : 'create'}
          size={24}
          color="white"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  inputBox: {
    borderWidth: 1,
    borderColor: '#007AFF', // blue border
    backgroundColor: '#E6F0FF', // light blue background
    color: '#000', // text color
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  iconButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 50,
    alignSelf: 'center',
    marginTop: 10,
  },
});
