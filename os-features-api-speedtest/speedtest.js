const fetch = require('node-fetch');
const flip = require('@turf/flip')

var apiKey = 'JydUr1HO7ejqBhw0YP19W3b1GonFwmzr';

var wfsServiceUrl = 'https://api.os.uk/features/v1/wfs',
    tileServiceUrl = 'https://api.os.uk/maps/raster/v1/zxy';



// Create an empty GeoJSON FeatureCollection.
var geoJson = {
    "type": "FeatureCollection",
    "features": []
};


var intCount = 100, // Maximum number of features to be returned in a single response.
    intStartIndex = 0; // Initial result to start from when returning a response.

function fetchAndTime(count, polygon = null) {

    var xml = '';

    if (polygon) {  

        polygon = flip(polygon);

        // Get the circle geometry coordinates and return a new space-delimited string.
        var coords = polygon.geometry.coordinates[0].join(' ');

        // Create an OGC XML filter parameter value which will select the Greenspace
        // features intersecting the circle polygon coordinates.
        xml = '<ogc:Filter>';
        xml += '<ogc:Intersects>';
        xml += '<ogc:PropertyName>SHAPE</ogc:PropertyName>';
        xml += '<gml:Polygon srsName="urn:ogc:def:crs:EPSG::4326">';
        xml += '<gml:outerBoundaryIs>';
        xml += '<gml:LinearRing>';
        xml += '<gml:coordinates>' + coords + '</gml:coordinates>';
        xml += '</gml:LinearRing>';
        xml += '</gml:outerBoundaryIs>';
        xml += '</gml:Polygon>';
        xml += '</ogc:Intersects>';
        xml += '</ogc:Filter>';

    }

    // Define parameters object.
    var wfsParams = {
        key: apiKey,
        service: 'WFS',
        request: 'GetFeature',
        version: '2.0.0',
        typeNames: 'Topography_TopographicArea',
        outputFormat: 'GEOJSON',
        srsName: 'urn:ogc:def:crs:EPSG::4326',
        filter: xml,
        count: 100,
        startIndex: 0
    };

    var resultsRemain = true;

    geoJson.features.length = 0;

    var hrstart = process.hrtime();

    // Use fetch() method to request GeoJSON data from the OS Features API.
    //
    // If successful - set the GeoJSON data for the 'greenspace' layer and re-render
    // the map.
    //
    // Calls will be made until the number of features returned is less than the
    // requested count, at which point it can be assumed that all features for
    // the query have been returned, and there is no need to request further pages.
    var pg = 1;

    function fetchWhile(resultsRemain) {
        if (resultsRemain) {

            var pagestart = process.hrtime();
            // console.log(getUrl(wfsParams))
            fetch(getUrl(wfsParams))
                .then(response => {

                    let pageend = process.hrtime(pagestart)
                    console.log("Page %i: %i features fetched in %dms", pg, wfsParams.count, (pageend[0] * 1e9 + pageend[1]) / 1000000)

                    return response.json()
                })
                .then((data) => {
                    wfsParams.startIndex += wfsParams.count;

                    geoJson.features.push.apply(geoJson.features, data.features);

                    resultsRemain = (geoJson.features.length >= count && data.features.length == wfsParams.count)
                        ? false 
                        : true;

                    pg++;
                    fetchWhile(resultsRemain);
                });
        }
        else {
            let hrend = process.hrtime(hrstart);
            console.log('==========================================')
            console.log("Total: %d features fetched in %dms", count, (hrend[0] * 1e9 + hrend[1])  / 1000000)

        }
    }

    fetchWhile(resultsRemain);
}

/**
 * Return URL with encoded parameters.
 * @param {object} params - The parameters object to be encoded.
 */
function getUrl(params) {
    var encodedParameters = Object.keys(params)
        .map(paramName => paramName + '=' + encodeURI(params[paramName]))
        .join('&');

    return wfsServiceUrl + '?' + encodedParameters;
}


var poly = {
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            -0.0164794921875,
            51.67511003567449
          ],
          [
            0.19775390625,
            51.67511003567449
          ],
          [
            0.19775390625,
            51.793328497122566
          ],
          [
            -0.0164794921875,
            51.793328497122566
          ],
          [
            -0.0164794921875,
            51.67511003567449
          ]
        ]
      ]
    }
  }

fetchAndTime(500, poly)