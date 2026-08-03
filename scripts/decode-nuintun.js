const sharp = require('sharp');
const { Decoder, binarize, grayscale } = require('@nuintun/qrcode');

async function decodeNuintun() {
  try {
    const imgPath = 'C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\e7c05660-7d62-41d8-90b2-acbc02cbacb0\\media__1785566581289.jpg';
    const decoder = new Decoder();

    // Save oriented image to temporary buffer
    const orientedBuf = await sharp(imgPath).rotate(90).toBuffer();
    const meta = await sharp(orientedBuf).metadata();
    console.log("Rotated Dimensions:", meta.width, "x", meta.height);

    for (let scale of [0.5, 0.6, 0.7, 0.8, 0.9, 1.0]) {
      for (let topRatio of [0.15, 0.2, 0.25, 0.3, 0.35]) {
        try {
          const cropW = Math.round(meta.width * scale);
          const cropH = Math.round(meta.height * scale);
          const cropL = Math.round((meta.width - cropW) / 2);
          const cropT = Math.round(meta.height * topRatio);

          if (cropL < 0 || cropT < 0 || cropL + cropW > meta.width || cropT + cropH > meta.height) continue;

          const { data, info } = await sharp(orientedBuf)
            .extract({ left: cropL, top: cropT, width: cropW, height: cropH })
            .raw()
            .ensureAlpha()
            .toBuffer({ resolveWithObject: true });

          const l = grayscale({ data: new Uint8Array(data), width: info.width, height: info.height });
          const m = binarize(l, info.width, info.height);
          const res = decoder.decode(m);

          if (res) {
            console.log("\n==========================================");
            console.log("SUCCESS_EMVCO_QRIS_STRING:");
            console.log(res.data);
            console.log("==========================================\n");
            return;
          }
        } catch (e) {
          // ignore loop try error
        }
      }
    }

    console.log("Failed all crop attempts.");
  } catch (err) {
    console.error("Error:", err);
  }
}

decodeNuintun();
