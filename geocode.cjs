const fs = require('fs');
const https = require('https');

const imageLocations = {
  "6E979A24-4273-4D85-8CE9-AA678082A688.JPG": "lacock abbey, uk",
  "IMG_0228.JPG": "anmore, bc, canada",
  "IMG_0302.jpg": "shannon falls, bc, canada",
  "IMG_0376.jpg": "stawamus chief provincial park, bc, canada",
  "IMG_0408.jpg": "stawamus chief provincial park, bc, canada",
  "IMG_0813.jpg": "joffre lakes provincial park, bc, canada",
  "IMG_0852.jpg": "lillooet, bc, canada",
  "IMG_1040.jpg": "mount robson, bc, canada",
  "IMG_1057.JPG": "jasper, ab, canada",
  "IMG_1126.JPG": "lake louise, ab, canada",
  "IMG_1260.jpg": "bow lake, ab, canada",
  "IMG_1311.jpg": "johnston canyon, ab, canada",
  "IMG_1448.JPG": "yoho national park, bc, canada",
  "IMG_1456.jpg": "bow lake, ab, canada",
  "IMG_1527.JPG": "moraine lake, ab, canada",
  "IMG_1555.JPG": "moraine lake, ab, canada",
  "IMG_1623.JPG": "banff, ab, canada",
  "IMG_1657.JPG": "banff, ab, canada",
  "IMG_1786.jpg": "mount revelstoke national park, bc, canada",
  "IMG_1808.jpg": "mount revelstoke national park, bc, canada",
  "IMG_1830.JPG": "bridal veil falls provincial park, bc, canada",
  "IMG_3729.jpg": "uttarakhand, india",
  "IMG_4103.jpg": "kedarnath, india",
  "IMG_4783.jpg": "kedarnath, india",
  "IMG_6505.JPG": "kedarnath, india",
  "IMG_6576.JPG": "kedarnath, india",
  "IMG_7396.jpg": "bath, uk",
  "IMG_7503.JPG": "bath, uk",
  "IMG_7559.JPG": "bath, uk",
  "IMG_7700.jpg": "london, uk",
  "dji_fly_20250722_141504_169_1753911275410_photo_optimized.JPG": "vancouver, bc, canada",
  "dji_fly_20250726_195126_214_1753910324590_photo_optimized.JPG": "vancouver, bc, canada"
};

const uniqueLocations = [...new Set(Object.values(imageLocations))];
const coordinates = {};

async function fetchLocation(loc) {
  return new Promise((resolve) => {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(loc)}&format=json&limit=1`;
    https.get(url, { headers: { 'User-Agent': 'Antigravity IDE Script/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.length > 0) {
            resolve({ lat: parseFloat(json[0].lat), lon: parseFloat(json[0].lon) });
          } else {
            console.error(`Not found: ${loc}`);
            resolve(null);
          }
        } catch (e) {
          console.error(`Error parsing ${loc}`);
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function run() {
  for (const loc of uniqueLocations) {
    const coord = await fetchLocation(loc);
    if (coord) {
      coordinates[loc] = coord;
    } else {
      // Add slight jitter for not found just to keep the script running
      coordinates[loc] = { lat: 0, lon: 0 };
    }
    // Rate limit for Nominatim is 1 request per second
    await new Promise(r => setTimeout(r, 1000));
  }

  let locsJson = {};
  try {
    locsJson = JSON.parse(fs.readFileSync('locations.json', 'utf8'));
  } catch (e) {
    console.log("Could not read locations.json, starting fresh");
  }

  for (const [img, locName] of Object.entries(imageLocations)) {
    if (coordinates[locName] && coordinates[locName].lat !== 0) {
      locsJson[img] = coordinates[locName];
    }
  }

  fs.writeFileSync('locations.json', JSON.stringify(locsJson, null, 2));
  console.log('Successfully updated locations.json');
}

run();
