
    var syncMove = require('@mapbox/mapbox-gl-sync-move');

    // Set API endpoint for VTS
    var serviceUrl = 'https://api.os.uk/maps/vector/v1/vts';

    // Set up OpenData Map
    var apiKeyOpenData = 'U5xtfqZXdd1OkNEp1G47nePuF3CrZhMm';

    var customStyleJson = 'https://raw.githubusercontent.com/OrdnanceSurvey/OS-Vector-Tile-API-Stylesheets/master/OS_VTS_3857_Open_Outdoor.json';

    // Initialize the map object.
    mapOpenData = new mapboxgl.Map({
        container: 'map-open-data',
        minZoom: 6,
        maxZoom: 18,
        style: customStyleJson,
        center:[ -2.96271235241079, 54.43276220221895],
        zoom: 16.2,
        transformRequest: url => {
            if(! /[?&]key=/.test(url) ) url += '?key=' + apiKeyOpenData
            return {
                url: url + '&srs=3857'
            }
        }
    });



    mapOpenData.dragRotate.disable(); // Disable map rotation using right click + drag.
    mapOpenData.touchZoomRotate.disableRotation(); // Disable map rotation using touch rotation gesture.

    // Add navigation control (excluding compass button) to the map.
    mapOpenData.addControl(new mapboxgl.NavigationControl({
        showCompass: false
    }));



    var apiKeyPremium = "JydUr1HO7ejqBhw0YP19W3b1GonFwmzr";

    // Initialize the map object.
    mapPremium = new mapboxgl.Map({
        container: 'map-premium-data',
        minZoom: 6,
        maxZoom: 18,
        style: serviceUrl + '/resources/styles?key=' + apiKeyPremium,
        center: [ -2.96271235241079, 54.43276220221895 ],
        zoom: 16.2,
        transformRequest: url => {
            return {
                url: url + '&srs=3857'
            }
        }
    });

    mapPremium.dragRotate.disable(); // Disable map rotation using right click + drag.
    mapPremium.touchZoomRotate.disableRotation(); // Disable map rotation using touch rotation gesture.

    // Add navigation control (excluding compass button) to the map.
    mapPremium.addControl(new mapboxgl.NavigationControl({
        showCompass: false
    }));

    syncMove(mapOpenData, mapPremium)