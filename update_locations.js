const fs = require('fs');
const locs = JSON.parse(fs.readFileSync('locations.json', 'utf8'));

const canada = { lat: 51.32247, lon: -116.1879116666667 };
const london = { lat: 51.51933833333333, lon: -0.1268721666666667 };
const india = { lat: 30.73429666666667, lon: 79.06915283333333 };

const mappings = {
  "IMG_0813.jpg": canada,
  "IMG_1040.jpg": canada,
  "IMG_1057.JPG": canada,
  "IMG_1126.JPG": canada,
  "IMG_1260.jpg": canada,
  "IMG_1311.jpg": canada,
  "IMG_1448.JPG": canada,
  "IMG_1456.jpg": canada,
  "IMG_1555.JPG": canada,
  "IMG_1623.JPG": canada,
  "IMG_1657.JPG": canada,
  "IMG_1808.jpg": canada,
  "6E979A24-4273-4D85-8CE9-AA678082A688.JPG": london,
  "IMG_3729.jpg": india,
  "IMG_4103.jpg": india
};

for (const key in mappings) {
  if (locs[key] === null) {
    locs[key] = mappings[key];
  }
}

fs.writeFileSync('locations.json', JSON.stringify(locs, null, 2));
console.log("Updated locations");
