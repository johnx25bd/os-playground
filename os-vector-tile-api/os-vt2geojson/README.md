# OS vector tile to GeoJSON

A quick script to convert an OS Vector Tile to GeoJSON. 

Demo script shows fetching one vector tile - easy to adapt to accept `z,x,y` and output GeoJSON. 

To run:

```bash
git clone git@github.com:johnx25bd/os-playground.git && cd os-playground/os-vector-tile-api/os-vt2geojson
# edit ./index.js to add Premium key from the OS Data Hub 
npm install
node index.js
# GeoJSON will print to the console
```