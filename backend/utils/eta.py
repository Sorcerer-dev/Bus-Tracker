import math

def haversine_distance(lat1, lon1, lat2, lon2):
    """
    Calculate the great-circle distance between two points on the Earth.
    Returns distance in kilometers.
    """
    R = 6371  # Earth's radius in km
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    c = 2 * math.asin(math.sqrt(a))
    return R * c  # distance in km

def estimate_eta(bus_lat, bus_lon, stop_lat, stop_lon, speed_kmph=30):
    """
    Estimate ETA (in minutes) between bus location and stop location.
    """
    distance = haversine_distance(bus_lat, bus_lon, stop_lat, stop_lon)
    eta_hours = distance / speed_kmph
    eta_minutes = round(eta_hours * 60)
    return eta_minutes
