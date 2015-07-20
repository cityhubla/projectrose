$(document).ready(function() {
    
//Loads Map    
L.mapbox.accessToken = 'pk.eyJ1IjoiY3J1emluNzN2dyIsImEiOiI3RDdhUi1NIn0.jaEqREZw7QQMRafKPNBdmA';    
        var map = L.mapbox.map('map', 'cruzin73vw.da0b9375',{minZoom:14, maxZoom:18})
        .setView([34.147844, -118.144392], 15);        
        L.mapbox.tileLayer('cruzin73vw.beyondblvd',{opacity:.2}).addTo(map);
    
        //URL to Markers
        var landmarks="https://spreadsheets.google.com/feeds/list/1u2b7ROtyt3_47Ah48ejiG5ALz0Z0Zfvo4RfdfTzboHQ/1/public/values?alt=json";
        var landmarkslayer = L.mapbox.featureLayer().addTo(map);
        var info = document.getElementById('infobox');
        var blvd ='data/coloradoblvd.geojson';
        var city ='data/cityboundary.geojson';
        var pasaODH='http://cityofpasadenaca.pasgis.opendata.arcgis.com/datasets/9f855c1de8af4fac94010719308978f2_0.geojson'
        var busroutes='http://cityofpasadenaca.pasgis.opendata.arcgis.com/datasets/242631d212c24bbfbd62e0138bfa1fa6_0.geojson';
        
//Function to return fill color    
function getcolor(d) {
            var d = String(d);
            return d == 'Current' ? '#DA8A29' :
                '#F05B7A';
        }
//Function to return fill color    
function getopacity(d) {
            var d = String(d);
            return d == 'Pasadena ARTS' ? 1 :
                0;
        }
    
//Adds Landmarks from Pasadena Open Data
        $.getJSON(pasaODH, function(data) {
        var pasa = L.geoJson(data, {
                style:{
                color: "#DA8A29",
                fill: "#DA8A29",
                fillOpacity:.5,
                weight: 0,
                },
        onEachFeature: function (feature, layer) {
        layer.bindPopup("<h2>"+feature.properties.PRC_CULT_HRTG_LANDMARK+"</h2>"+"<p>"+feature.properties.PRC_PRIMARY_SITEADDR+"</p>");
        }    
        }).addTo(map);
        });
    
        $.getJSON(busroutes, function(data) {
        console.log(data);    
        var routesLayer = L.geoJson(data, {
                style:{
                color: "aqua",
                weight: 2,
                opacity:1,
                filter: function(feature, layer) {
                return feature.properties.AGENCY=="Pasadena ARTS";
                console.log(feature);
                },
                onEachFeature: function (feature, layer) {
        layer.bindPopup(feature.properties.AGENCY+" Bus Route "+feature.properties.ROUTE_NUMBER);
        }
        }}).addTo(map);
        });
    
//Loads Markers from Google Sheets        
        $.getJSON(landmarks, function(data) {
        $.each(data.feed.entry, function(i,result){
        L.circle([result.gsx$latitude.$t, result.gsx$longitude.$t], 20, {
                fillColor:getcolor(result.gsx$status.$t),
                color: "#000",
                weight: 0,
                opacity: 0,
                fillOpacity: 0.8
        }).bindPopup('<img src="http://maps.googleapis.com/maps/api/streetview?size=400x200&location='+result.gsx$latitude.$t+','+result.gsx$longitude.$t+'&key=AIzaSyAEjGc0IbjncA-YzKrpiTBHRhELUrruHao", width="100%">'+
                     "<h2>"+result.gsx$name.$t+"<br>"+result.gsx$address.$t+"</h2><p>"+result.gsx$description.$t,{autoPan:false}).addTo(landmarkslayer);
        });
        });
    
//Adds Colorado Blvd Polyline
        $.getJSON(blvd, function(data) {
        var blvdlayer = L.geoJson(data, {
                style:{
                color: "#EE405F",
                weight: 5,
                dashArray:"3,8",
                opacity:1
                }
        }).addTo(map);
        });
    
//Adds City Boundary Polyline
        $.getJSON(city, function(data) {
        var city = L.geoJson(data, {
                style:{
                color: "#ff78b4",
                weight: 5,
                fill:false,
                clickable:false
                }
        }).addTo(map);
        });    
//Add image overlay
var imageURL='images/floatlabel-05.png', imageBounds =[[34.145500,-118.147236],[34.141806,-118.121470]];
L.imageOverlay(imageURL,imageBounds,{opacity:.5}).addTo(map);
 

//Popup to infobox    
    landmarkslayer.on('click',function(e) {
    e.layer.closePopup();    
    info.innerHTML = e.layer._popup._content;
    });
    
 /* Toggle Box
        mapopen.onclick = function () {
            $('#info').toggle("slow");
        }; */   

//Walking Radius Style

var walkrad={
    "color": "#EE405F",
    "weight": 2,
    "fillOpacity":0,
    "opacity": 0.85,
    "dashArray":"5,5",
    "clickable":false
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
        console.log([e.latlng.lng, e.latlng.lat]);
        L.circle([34.147844, -118.144392], 804.672, walkrad).bindLabel('Half mile from where you are',{noHide:true}).addTo(map);    
        L.circle([34.147844, -118.144392], 20,walkrad).addTo(map);


        // And hide the geolocation button
        geolocate.parentNode.removeChild(geolocate);
         });

        // If the user chooses not to allow their location
        // to be shared, display an error message.
        map.on('locationerror', function() {
        geolocate.innerHTML = 'Position could not be found';
        });
});