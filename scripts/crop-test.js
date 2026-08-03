const sharp = require('sharp');
const jsQR = require('jsqr');

async function testCropBox() {
  const imgPath = 'C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\e7c05660-7d62-41d8-90b2-acbc02cbacb0\\media__1785566581289.jpg';
  
  // Extract center square
  // image width: 793, height: 446
  // QR is in the center
  for (let topRatio of [0.05, 0.1, 0.15, 0.2, 0.25]) {
    for (let hRatio of [0.6, 0.7, 0.8, 0.9]) {
      try {
        const cropH = Math.round(446 * hRatio);
        const cropW = cropH; // square box
        const cropL = Math.round((793 - cropW) / 2);
        const cropT = Math.round(446 * topRatio);

        if (cropL < 0 || cropT < 0 || cropL + cropW > 793 || cropT + cropH > 446) continue;

        const { data, info } = await sharp(imgPath)
          .extract({ left: cropL, top: cropT, width: cropW, height: cropH })
          .resize(500, 500, { fit: 'fill' })
          .raw()
          .ensureAlpha()
          .toBuffer({ resolveWithObject: true });

        const result = jsQR(new Uint8ClampedArray(data), info.width, info.height);
        if (result && result.data) {
          console.log("\n==========================================");
          console.log("SUCCESS_EMVCO_QRIS_STRING:");
          console.log(result.data);
          console.log("==========================================\n");
          return;
        }
      } catch (err) {
        // ignore
      }
    }
  }

  console.log("Crop test complete.");
}

testCropBox();
