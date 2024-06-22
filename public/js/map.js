{/* <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script> */}
let map = L.map('map').setView([listing.geometry.coordinates[1],listing.geometry.coordinates[0]], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    let marker = L.marker([listing.geometry.coordinates[1],listing.geometry.coordinates[0]]).addTo(map);
    var circle = L.circle([listing.geometry.coordinates[1],listing.geometry.coordinates[0]], {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 500
    }).addTo(map);
    let polygon = L.polygon([
            [listing.geometry.coordinates[1],listing.geometry.coordinates[0]],
            [listing.geometry.coordinates[1],listing.geometry.coordinates[0]],
            [listing.geometry.coordinates[1],listing.geometry.coordinates[0]]
        ]).addTo(map);
    marker.bindPopup(`<h4><b>${listing.title}</b></h4>
        <p>Exact Location provided after booking</p>.`).openPopup();
    let popup = L.popup()
        .setLatLng([coordinates[1],coordinates[0]])
        .setContent("I am a standalone popup.")
        .openOn(map);

    function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
            .setContent("You clicked the map at " + e.latlng.toString())
            .openOn(map);
    }
    
    map.on('click', onMapClick);
    console.log(coordinates);
    console.log(listing.geometry.coordinates[1]," ",listing.geometry.coordinates[0]);