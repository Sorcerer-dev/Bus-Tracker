from flask import Flask, jsonify, render_template_string, request
from datetime import datetime
import os
from flask_cors import CORS
from routes.location import location_bp, bus_locations
from utils.eta import estimate_eta

app = Flask(__name__)
CORS(app)

# Register routes from location.py
app.register_blueprint(location_bp)

@app.route('/')
def home():
    return "🚌 Bus Tracking API is running!"

@app.route('/ping')
def ping():
    return {"status": "ok"}, 200

# 🖥 Simple HTML live view for testing
@app.route('/live')
def live_view():
    bus_id = "BUS001"
    bus = bus_locations.get(bus_id)

    if not bus:
        return "<h2>No location data available for BUS001 yet.</h2>"

    html = f"""
    <html>
        <head>
            <title>Live Bus Location</title>
            <meta http-equiv="refresh" content="3" />
        </head>
        <body>
            <h2>Live Coordinates for Bus: {bus_id}</h2>
            <p><strong>Latitude:</strong> {bus['lat']}</p>
            <p><strong>Longitude:</strong> {bus['lon']}</p>
            <p><strong>Last Updated:</strong> {bus['timestamp']}</p>
        </body>
    </html>
    """
    return render_template_string(html)

# ⏱ ETA endpoint for React Native
@app.route('/eta', methods=['POST'])
def eta():
    data = request.get_json()

    bus_lat = data.get("bus_lat")
    bus_lon = data.get("bus_lon")
    stop_lat = data.get("user_lat")  # match RN naming
    stop_lon = data.get("user_lon")

    # Validate parameters
    if None in [bus_lat, bus_lon, stop_lat, stop_lon]:
        return jsonify({"error": "Missing required parameters"}), 400

    try:
        eta_minutes = estimate_eta(float(bus_lat), float(bus_lon), float(stop_lat), float(stop_lon))
        return jsonify({"eta": eta_minutes})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
