const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const galleryPath = path.join(__dirname, 'src/assets/gallery');
const files = fs.readdirSync(galleryPath).filter(f => f.match(/\.(jpg|jpeg|png)$/i));

const locations = {};

for (const file of files) {
  try {
    const fullPath = path.join(galleryPath, file);
    const output = execSync(`mdls -name kMDItemLatitude -name kMDItemLongitude "${fullPath}"`, { encoding: 'utf-8' });
    
    let lat = null, lon = null;
    
    const latMatch = output.match(/kMDItemLatitude\s*=\s*([\d\.-]+)/);
    const lonMatch = output.match(/kMDItemLongitude\s*=\s*([\d\.-]+)/);
    
    if (latMatch && lonMatch) {
      lat = parseFloat(latMatch[1]);
      lon = parseFloat(lonMatch[1]);
      locations[file] = { lat, lon };
    } else {
      locations[file] = null;
    }
  } catch(e) {}
}

console.log(JSON.stringify(locations, null, 2));
