// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2019-05-17&endtime=" +
  "2019-05-18&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

  // Create a map object
var myMap = L.map("map", {
  center: [39.5994, -98.6731],
  zoom: 4
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets-basic",
  accessToken: API_KEY
}).addTo(myMap);

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // console.log(data)
  // Loop through data and plot a circle for each quake
  for (var i = 0; i < data.features.length; i++) {

    // Conditionals for magnitude of earthquake
    var color = "";
    if (data.features[i].properties.mag > 2) {
      color = "red";
    }
    else if (data.features[i].properties.mag  > 1) {
      color = "orange";
    }
    else if (data.features[i].properties.mag  > 0.5) {
      color = "yellow";
    }
    else {
      color = "green";
      // console.log(color)
    }
  
    // Add circles to map
    L.circle([data.features[i].geometry.coordinates[1], data.features[i].geometry.coordinates[0]],{
      fillOpacity: 0.75,
      //make colors based on conditionals above
      color: color,
      fillColor: color,
      // Adjust radius
      radius:data.features[i].properties.mag * 10000
      
      //add a dataset bindpopup to data
    }).bindPopup("<h3>" + data.features[i].properties.place +
    "</h3><hr><p>" + new Date(data.features[i].properties.time) + "</p>").addTo(myMap);
    // console.log(data.features[i].geometry.coordinates[1], data.features[i].geometry.coordinates[0])
      
  }
});

//creating a legend
function getColor(d) {
  return d === "magnitude >2" ? 'red' :
         d === "magnitude 1-2"  ? 'orange' :
         d ==="magnitude 0.5-1"  ? 'yellow' :
                   'green' ;
         
}

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
        mags = ["magnitude >2","magnitude 1-2","magnitude 0.5-1","magnitude < 0.5"],
        // mags = [2,1,0.5,0],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < mags.length; i++) {
      div.innerHTML += 
      labels.push(
          '<i style="background:' + getColor(mags[i]) + '"></i> ' +
          (mags[i] ? mags[i] : '+'));
  }

  div.innerHTML = labels.join('<br>');
return div;
// };div.innerHTML +=
//             '<i style="background:' + getColor(mags[i]+1) + '"></i> ' +
           
//     }
    // mags[i]  ? '&ndash;' + mags[i] + '<br>' : '+';
    return div;
};

legend.addTo(myMap);
