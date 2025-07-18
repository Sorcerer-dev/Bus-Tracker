import 'package:flutter/material.dart';
import 'package:location/location.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: Text('Bus Tracker')),
        body: LocationSender(),
      ),
    );
  }
}

class LocationSender extends StatefulWidget {
  @override
  _LocationSenderState createState() => _LocationSenderState();
}

class _LocationSenderState extends State<LocationSender> {
  Location location = new Location();

  void sendLocation() async {
    var loc = await location.getLocation();
    var response = await http.post(
      Uri.parse('http://your-server-ip:5000/location'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'bus_id': 'BUS001',
        'lat': loc.latitude,
        'lon': loc.longitude,
        'timestamp': DateTime.now().toIso8601String()
      }),
    );
    print(response.body);
  }

  @override
  void initState() {
    super.initState();
    location.requestPermission();
    location.onLocationChanged.listen((loc) => sendLocation());
  }

  @override
  Widget build(BuildContext context) {
    return Center(child: Text('Sending location...'));
  }
}