const socket = io();

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
});

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            console.log('Sending location:', { latitude, longitude });
            socket.emit("send-location", { latitude, longitude });
        },
        (error) => {
            console.error("Geolocation error:", error);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        }
    );
} else {
    console.error("Geolocation is not supported by this browser.");
}

const map = L.map("map").setView([0, 0], 3);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Open Street Map By Ajay Dodiya",
}).addTo(map);

const marker = {};

socket.on("receive-location", (data) => {
    console.log('Received location data:', data);
    const { id, latitude, longitude } = data;

    if (latitude && longitude) {
        map.setView([latitude, longitude]);

        if (marker[id]) {
            marker[id].setLatLng([latitude, longitude]);
        } else {
            marker[id] = L.marker([latitude, longitude]).addTo(map);
        }
    } else {
        console.error("Invalid location data received:", data);
    }
});
