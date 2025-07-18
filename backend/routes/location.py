from flask import Blueprint, request, jsonify
from utils.eta import calculate_eta

location_bp = Blueprint('location', __name__)
bus_locations = {}

@location_bp.route('/location', methods=['POST'])
def update_location():
    data = request.json
    bus_id = data['bus_id']
    bus_locations[bus_id] = {
        'lat': data['lat'],
        'lon': data['lon'],
        'timestamp': data['timestamp']
    }
    return jsonify({'status': 'updated'})

@location_bp.route('/bus-location/<bus_id>', methods=['GET'])
def get_bus_location(bus_id):
    return jsonify(bus_locations.get(bus_id, {}))

@location_bp.route('/eta', methods=['GET'])
def get_eta():
    bus_id = request.args.get('bus_id')
    stop_lat = float(request.args.get('stop_lat'))
    stop_lon = float(request.args.get('stop_lon'))

    bus = bus_locations.get(bus_id)
    if not bus:
        return jsonify({'error': 'Bus not found'}), 404

    eta = calculate_eta(bus['lat'], bus['lon'], stop_lat, stop_lon)
    return jsonify({'eta_minutes': eta})