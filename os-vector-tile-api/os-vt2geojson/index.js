const vt2geojson = require('@mapbox/vt2geojson');

const apikey = "YOUR_KEY_HERE";

async function osTile2geojson(z,x,y) {
        
    // remote file
    vt2geojson({
        uri: `https://api.os.uk/maps/vector/v1/vts/tile/${z}/${y}/${x}.pbf?key=${apikey}&srs=3857`
    }, function (err, result) {
        if (err) throw err;

        // Add output code here - write to disk, etc.
        console.log(result); // => GeoJSON FeatureCollection
    });

}


osTile2geojson(15, 16092, 10212)