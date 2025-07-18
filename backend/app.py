from flask import Flask, jsonify
from datetime import datetime
from routes.location import location_bp

app = Flask(__name__)
app.register_blueprint(location_bp)

@app.route('/')
def home():
    return "🚌 Bus Tracking API is running!"

# Temporary GET route for testing from phone or browser
@app.route('/location', methods=['GET', 'POST'])
def location():
    return jsonify({
        'lat': 19.0760,
        'lon': 72.8777,
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
