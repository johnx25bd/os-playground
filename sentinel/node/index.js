const response = fetch("https://services.sentinel-hub.com/api/v1/process", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer <your_access_token>"
  },
  body: JSON.stringify({
  "input": {
    "bounds": {
      "bbox": [
        13.822174072265625,
        45.85080395917834,
        14.55963134765625,
        46.29191774991382
      ]
    },
    "data": [{
      "type": "S2L2A"
    }]
  },
  "evalscript": `
    //VERSION=3

    function setup() {
      return {
        input: ["B02", "B03", "B04"],
        output: {
          bands: 3
        }
      };
    }

    function evaluatePixel(
      sample,
      scenes,
      inputMetadata,
      customData,
      outputMetadata
    ) {
      return [2.5 * sample.B04, 2.5 * sample.B03, 2.5 * sample.B02];
    }
    `
  })
})
