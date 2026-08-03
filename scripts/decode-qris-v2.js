const sharp = require('sharp');
const jsQR = require('jsqr');

async function decode() {
  try {
    const imgPath = 'C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\e7c05660-7d62-41d8-90b2-acbc02cbacb0\\media__1785759402542.png';
    
    const meta = await sharp(imgPath).metadata();
    console.log("Image dimensions:", meta.width, "x", meta.height);

    // Try multiple strategies to decode the QR
    const strategies = [
      // Strategy 1: Center crop where QR code is
      async () => {
        const cropWidth = Math.round(meta.width * 0.65);
        const cropHeight = Math.round(meta.height * 0.45);
        const cropLeft = Math.round((meta.width - cropWidth) / 2);
        const cropTop = Math.round(meta.height * 0.25);

        const { data, info } = await sharp(imgPath)
          .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
          .resize(600, 600, { fit: 'inside' })
          .sharpen()
          .normalize()
          .raw()
          .ensureAlpha()
          .toBuffer({ resolveWithObject: true });

        return jsQR(new Uint8ClampedArray(data), info.width, info.height);
      },
      // Strategy 2: Tighter center crop  
      async () => {
        const cropWidth = Math.round(meta.width * 0.55);
        const cropHeight = Math.round(meta.height * 0.38);
        const cropLeft = Math.round((meta.width - cropWidth) / 2);
        const cropTop = Math.round(meta.height * 0.28);

        const { data, info } = await sharp(imgPath)
          .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
          .resize(800, 800, { fit: 'inside' })
          .grayscale()
          .sharpen()
          .normalize()
          .raw()
          .ensureAlpha()
          .toBuffer({ resolveWithObject: true });

        return jsQR(new Uint8ClampedArray(data), info.width, info.height);
      },
      // Strategy 3: Larger area with high contrast
      async () => {
        const { data, info } = await sharp(imgPath)
          .resize(1200, 1200, { fit: 'inside' })
          .grayscale()
          .sharpen({ sigma: 2 })
          .normalize()
          .raw()
          .ensureAlpha()
          .toBuffer({ resolveWithObject: true });

        return jsQR(new Uint8ClampedArray(data), info.width, info.height);
      },
      // Strategy 4: Direct full image no preprocessing
      async () => {
        const { data, info } = await sharp(imgPath)
          .raw()
          .ensureAlpha()
          .toBuffer({ resolveWithObject: true });

        return jsQR(new Uint8ClampedArray(data), info.width, info.height);
      },
      // Strategy 5: Threshold binarization
      async () => {
        const { data, info } = await sharp(imgPath)
          .resize(1000, 1000, { fit: 'inside' })
          .grayscale()
          .threshold(100)
          .raw()
          .ensureAlpha()
          .toBuffer({ resolveWithObject: true });

        return jsQR(new Uint8ClampedArray(data), info.width, info.height);
      },
    ];

    for (let i = 0; i < strategies.length; i++) {
      try {
        console.log(`\nTrying strategy ${i + 1}...`);
        const code = await strategies[i]();
        if (code) {
          console.log("===== SUCCESS =====");
          console.log("QRIS_STRING:", code.data);
          console.log("String Length:", code.data.length);
          return;
        } else {
          console.log(`Strategy ${i + 1}: No QR found`);
        }
      } catch (err) {
        console.log(`Strategy ${i + 1} error:`, err.message);
      }
    }

    console.log("\nAll strategies FAILED to decode QRIS");
  } catch (err) {
    console.error("ERROR:", err);
  }
}

decode();
