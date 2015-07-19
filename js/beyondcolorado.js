$(document).ready(function() {
    
//Loads Map    
L.mapbox.accessToken = 'pk.eyJ1IjoiY3J1emluNzN2dyIsImEiOiI3RDdhUi1NIn0.jaEqREZw7QQMRafKPNBdmA';    
        var map = L.mapbox.map('map', 'cruzin73vw.da0b9375','backtile')
        .setView([34.147844, -118.144392], 14);        
        
        //URL to Markers
        var landmarks="https://spreadsheets.google.com/feeds/list/1u2b7ROtyt3_47Ah48ejiG5ALz0Z0Zfvo4RfdfTzboHQ/1/public/values?alt=json";
        var landmarkslayer = L.mapbox.featureLayer().addTo(map);
        var info = document.getElementById('infobox');
        
        function getcolor(d) {
            var d = String(d);
            return d == 'Current' ? '#ff7f00' :
                'blue';
        }
        
//Loads Markers from Google Sheets        
        $.getJSON(landmarks, function(data) {
        $.each(data.feed.entry, function(i,result){
        L.circleMarker([result.gsx$latitude.$t, result.gsx$longitude.$t], {
                fillColor:getcolor(result.gsx$status.$t),
                color: "#000",
                weight: 0,
                opacity: 0,
                fillOpacity: 0.8
        }).bindPopup('<img src="http://maps.googleapis.com/maps/api/streetview?size=265x150&location='+result.gsx$latitude.$t+','+result.gsx$longitude.$t+'&key=AIzaSyAEjGc0IbjncA-YzKrpiTBHRhELUrruHao">'+
                     "<h2>"+result.gsx$name.$t+"<br>"+result.gsx$address.$t+"</h2><p>"+result.gsx$description.$t).addTo(landmarkslayer);
        });
        });
    
       
//Popup to infobox    
    landmarkslayer.on('click',function(e) {
    e.layer.closePopup();    
    info.innerHTML = e.layer._popup._content;
    });
    
//Toggle Box
        mapopen.onclick = function () {
            $('#info').toggle("slow");
        };    

    
//Geolocation    
        var geolocation = L.mapbox.featureLayer().addTo(map);
        
        var mapbounds=map.getBounds();
        console.log(mapbounds);
        
        var geolocate = document.getElementById('geolocate');
        
        if (!navigator.geolocation) {
        geolocate.innerHTML = 'Geolocation is not available';
        } else {
        geolocate.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        map.locate();
        };
        }
        map.on('locationfound', function(e) {
            
     
        geolocation.setGeoJSON({
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [e.latlng.lng, e.latlng.lat]
        },
        properties: {
            'title': 'Here I am!',
            'marker-color': '#ff8888',
            'marker-symbol': 'star'
        }
        });

        // And hide the geolocation button
        geolocate.parentNode.removeChild(geolocate);
         });

        // If the user chooses not to allow their location
        // to be shared, display an error message.
        map.on('locationerror', function() {
        geolocate.innerHTML = 'Position could not be found';
        });
});