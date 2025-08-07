from flask import Blueprint, request, jsonify
from utils.eta import calculate_eta
from datetime import datetime
from flask_cors import cross_origin

location_bp = Blueprint('location', __name__)
bus_locations = {}  # Temporary in-memory storage

@location_bp.route('/location', methods=['POST'])
@cross_origin()
def update_location():
    try:
        data = request.json
        bus_id = data.get('bus_id')
        lat = float(data.get('lat'))
        lon = float(data.get('lon'))
        timestamp = data.get('timestamp') or datetime.utcnow().isoformat()

        if not bus_id:
            return jsonify({'error': 'Missing bus_id'}), 400

        bus_locations[bus_id] = {
            'lat': lat,
            'lon': lon,
            'timestamp': timestamp
        }
        return jsonify({'status': 'updated'})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@location_bp.route('/bus-location/<bus_id>', methods=['GET'])
@cross_origin()
def get_bus_location(bus_id):
    location = bus_locations.get(bus_id)
    if not location:
        return jsonify({'error': 'Location not found'}), 404
    return jsonify(location)

@location_bp.route('/eta', methods=['GET'])
@cross_origin()
def get_eta():
    try:
        bus_id = request.args.get('bus_id')
        stop_lat = float(request.args.get('stop_lat'))
        stop_lon = float(request.args.get('stop_lon'))

        bus = bus_locations.get(bus_id)
        if not bus:
            return jsonify({'error': 'Bus not found'}), 404

        eta = calculate_eta(bus['lat'], bus['lon'], stop_lat, stop_lon)
        return jsonify({'eta_minutes': eta})

    except Exception as e:
        return jsonify({'error': str(e)}), 500
