var map=L.map('map').setView([40.71, -73.93], 11);

var OpenStreetMap_HOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
});

map.addLayer(OpenStreetMap_HOT);

var vzGeoJSON;
var neighborhoodsGeoJSON;

$.getJSON( "geojson/speed_limit_brooklyn.geojson", function( data ) {
    // ensure jQuery has pulled all data out of the geojson file
    var vz = data;
    console.log(vz);

    var vzStyle = function (feature){
    	var value = feature.properties.postvz_sl;
    	var lineColor = null;
    	if (value > 25){
    		lineColor = 'green';
    	}
    	else if (value == 25){
    		lineColor = 'yellow';
    	}
    	else if (value < 25){
    		lineColor = 'red';
    	}
	    var style = {
	    	weight: 3,
	    	opacity: 0.7,
	    	color: lineColor, 
	    };
	    return style;
   	
    }

    // function that binds popup data to subway lines
    var vzClick = function (feature, layer) {
        // console.log('feature: ', feature);
        // console.log('feature.properties.Line: ', feature.properties.Line);
        // let's bind some feature properties to a pop up
        layer.bindPopup("Street: " + feature.properties.street + "<br/>Speed Limit: " + feature.properties.postvz_sl);
    }

    // using L.geojson add subway lines to map
    vzGeoJSON = L.geoJson(vz, {
        // pointToLayer: vzPointToLayer,
        style: vzStyle,
        onEachFeature: vzClick
    }).addTo(map);

});


$.getJSON( "geojson/NYC_neighborhood_data.geojson", function( data ) {
    // ensure jQuery has pulled all data out of the geojson file
    var neighborhoods = data;

    // console.log(neighborhoods);

    // neighborhood choropleth map
    // let's use % in poverty to color the neighborhood map
    var popStyle = function (feature){
        var value = feature.properties.Pop;
        var fillColor = null;
        if(value >= 0 && value <=5000){
            fillColor = "#fee5d9";
        }
        else if(value >5000 && value <=20000){
            fillColor = "#fcbba1";
        }
        else if(value >20000 && value<=50000){
            fillColor = "#fc9272";
        }
        else if(value > 50000 && value <=100000){
            fillColor = "#fb6a4a";
        }
        else if(value > 100000 && value <=150000) { 
            fillColor = "#de2d26";
        }
        else if(value > 150000) { 
            fillColor = "#a50f15";
        }
       // console.log(value);
 

        var style = {
            weight: 1,
            opacity: .1,
            color: 'white',
            fillOpacity: 0.75,
            fillColor: fillColor
        };

        return style;
    }

    var popClick = function (feature, layer) {
        var pop = feature.properties.Pop;
        // let's bind some feature properties to a pop up
        layer.bindPopup("<strong>Neighborhood:</strong> " + feature.properties.NYC_NEIG + "<br /><strong>Population: </strong>" + pop);
    }

    neighborhoodsGeoJSON = L.geoJson(neighborhoods, {
        style: popStyle,
        onEachFeature: popClick
    }).addTo(map);


    // create layer controls
    createLayerControls(); 

});

function createLayerControls(){
	var baseMaps = {
		"OSM": OpenStreetMap_HOT
	};
	var overlayMaps = {
		"Population Map": neighborhoodsGeoJSON,
		"Vision Zero Map": vzGeoJSON
	};
	L.control.layers(baseMaps, overlayMaps).addTo(map);
}