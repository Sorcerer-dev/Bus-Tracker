from geopy.distance import geodesic

def calculate_eta(lat1, lon1, lat2, lon2, speed_kmph=30):
    distance_km = geodesic((lat1, lon1), (lat2, lon2)).km
    eta_minutes = (distance_km / speed_kmph) * 60
    return round(eta_minutes)
