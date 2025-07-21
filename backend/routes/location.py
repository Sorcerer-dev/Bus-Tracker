from flask import Blueprint, request, jsonify
from utils.eta import calculate_eta

location_bp = Blueprint('location', __name__)
bus_locations = {}

@location_bp.route('/location', methods=['POST'])
def update_location():
    data = request.json
    bus_id = data.get('bus_id')
    lat = data.get('lat')
    lon = data.get('lon')
    timestamp = data.get('timestamp')

    if not bus_id or lat is None or lon is None:
        return jsonify({'error': 'Missing bus_id or coordinates'}), 400

    bus_locations[bus_id] = {
        'lat': lat,
        'lon': lon,
        'timestamp': timestamp
    }
    return jsonify({'status': 'updated'})

@location_bp.route('/bus-location/<bus_id>', methods=['GET'])
def get_bus_location(bus_id):
    location = bus_locations.get(bus_id)
    if not location:
        return jsonify({'error': 'Location not found'}), 404
    return jsonify(location)

@location_bp.route('/eta', methods=['GET'])
def get_eta():
    bus_id = request.args.get('bus_id')
    stop_lat = request.args.get('stop_lat')
    stop_lon = request.args.get('stop_lon')

    bus = bus_locations.get(bus_id)
    if not bus or stop_lat is None or stop_lon is None:
        return jsonify({'error': 'Missing data for ETA calculation'}), 400

    eta = calculate_eta(bus['lat'], bus['lon'], float(stop_lat), float(stop_lon))
    return jsonify({'eta_minutes': eta})
