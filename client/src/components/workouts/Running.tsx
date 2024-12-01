import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import geolib from "geolib"; 

// Helper function to estimate calories burned based on distance
const estimateCalories = (distance: number, weight: number = 70) => {
  const MET_RUNNING = 9.8; // MET value for running (varies by speed, we use an average for simplicity)
  const caloriesPerKm = (MET_RUNNING * weight * 3.5) / 200;
  return caloriesPerKm * distance;
};

const RunningTracker: React.FC = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [distance, setDistance] = useState(0); // Total distance covered (in km)
  const [caloriesBurned, setCaloriesBurned] = useState(0); // Calories burned based on distance
  const [tracking, setTracking] = useState(false); // To control start/stop of tracking
  const [path, setPath] = useState<L.LatLng[]>([]); // To store the running path
  const previousLocation = useRef<{ lat: number; lng: number } | null>(null); // To store the previous position for distance calculation

  // Function to handle location updates
  const handleLocationUpdate = (position: GeolocationPosition) => {
    const newLocation = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };

    if (previousLocation.current) {
      // Calculate distance between current and previous position
      const newDistance =
        geolib.getDistance(previousLocation.current, newLocation) / 1000; // Convert to km
      setDistance((prev) => prev + newDistance);
      setCaloriesBurned(estimateCalories(distance + newDistance)); // Estimate calories burned
    }

    // Add the current location to the path
    setPath((prevPath) => [
      ...prevPath,
      new L.LatLng(newLocation.lat, newLocation.lng),
    ]);

    // Update the previous location for the next distance calculation
    previousLocation.current = newLocation;
    setLocation(newLocation);
  };

  // Effect to start/stop tracking when the user presses buttons
  useEffect(() => {
    if (tracking) {
      const watchId = navigator.geolocation.watchPosition(
        handleLocationUpdate,
        (err) => console.error(err),
        {
          enableHighAccuracy: true, // Ensure high accuracy for location updates
          maximumAge: 0, // Don't use cached locations
          timeout: 5000, // Timeout after 5 seconds if no update
        }
      );

      // Cleanup the watch when tracking stops or component unmounts
      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, [tracking, distance]);

  return (
    <div className="mt-44">
      <h1>Running Tracker</h1>
      <div>
        <button onClick={() => setTracking(true)} disabled={tracking}>
          Start Tracking
        </button>
        <button onClick={() => setTracking(false)} disabled={!tracking}>
          Stop Tracking
        </button>
      </div>

      {location && (
        <MapContainer
          center={location}
          zoom={15}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <Marker position={location}>
            <Popup>Your current location</Popup>
          </Marker>

          {/* Polyline to show running path */}
          <Polyline positions={path} color="blue" weight={5} opacity={0.7} />
        </MapContainer>
      )}

      {/* Display Distance and Calories */}
      <div>
        <p>Distance Covered: {distance.toFixed(2)} km</p>
        <p>Calories Burned: {caloriesBurned.toFixed(2)} kcal</p>
      </div>
    </div>
  );
};

export default RunningTracker;
