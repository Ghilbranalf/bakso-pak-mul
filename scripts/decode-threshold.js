const sharp = require('sharp');
const jsQR = require('jsqr');

async function decodeThreshold() {
  const imgPath = 'C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\e7c05660-7d62-41d8-90b2-acbc02cbacb0\\media__1785566581289.jpg';
  
  // Try different thresholds and rotations
  for (let threshold of [100, 120, 128, 140, 160, 180]) {
    for (let rot of [0, 90, 180, 270]) {
      try {
        let pipeline = sharp(imgPath);
        if (rot > 0) pipeline = pipeline.rotate(rot);

        const { data, info } = await pipeline
          .threshold(threshold)
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

  console.log("Threshold search complete.");
}

decodeThreshold();
