from flask import Flask, jsonify, render_template_string
from datetime import datetime
from routes.location import location_bp, bus_locations  # import bus_locations dictionary

app = Flask(__name__)
app.register_blueprint(location_bp)

@app.route('/')
def home():
    return "🚌 Bus Tracking API is running!"

@app.route('/live')
def live_view():
    # You can adjust this to display any bus_id you like
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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
