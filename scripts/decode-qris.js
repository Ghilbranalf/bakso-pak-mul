const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const jsQR = require('jsqr');

async function decode() {
  try {
    const imgPath = 'C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\e7c05660-7d62-41d8-90b2-acbc02cbacb0\\media__1785566581289.jpg';
    
    // Get image dimensions
    const meta = await sharp(imgPath).metadata();
    console.log("Image dimensions:", meta.width, meta.height);

    // Crop center 60% of the image where the QR code resides
    const cropWidth = Math.round(meta.width * 0.7);
    const cropHeight = Math.round(meta.height * 0.5);
    const cropLeft = Math.round((meta.width - cropWidth) / 2);
    const cropTop = Math.round(meta.height * 0.28);

    const { data, info } = await sharp(imgPath)
      .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
      .raw()
      .ensureAlpha()
      .toBuffer({ resolveWithObject: true });

    const code = jsQR(new Uint8ClampedArray(data), info.width, info.height);
    if (code) {
      console.log("SUCCESS_QRIS_STRING:", code.data);
    } else {
      console.log("FAILED: Trying full grayscale resize...");
      
      const { data: d2, info: i2 } = await sharp(imgPath)
        .resize(800, 800, { fit: 'inside' })
        .grayscale()
        .raw()
        .ensureAlpha()
        .toBuffer({ resolveWithObject: true });

      const code2 = jsQR(new Uint8ClampedArray(d2), i2.width, i2.height);
      if (code2) {
        console.log("SUCCESS_QRIS_STRING:", code2.data);
      } else {
        console.log("FAILED to decode QRIS string");
      }
    }
  } catch (err) {
    console.error("ERROR:", err);
  }
}

decode();
