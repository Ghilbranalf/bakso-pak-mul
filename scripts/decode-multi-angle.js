const sharp = require('sharp');
const { Decoder, binarize, grayscale } = require('@nuintun/qrcode');

async function decodeMultiAngle() {
  try {
    const imgPath = 'C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\e7c05660-7d62-41d8-90b2-acbc02cbacb0\\media__1785566581289.jpg';
    const decoder = new Decoder();

    for (let angle of [0, 90, 180, 270]) {
      console.log("Testing angle:", angle);
      const orientedBuf = angle === 0 ? await sharp(imgPath).toBuffer() : await sharp(imgPath).rotate(angle).toBuffer();
      const meta = await sharp(orientedBuf).metadata();

      for (let scale of [0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]) {
        for (let topRatio of [0.1, 0.2, 0.25, 0.3, 0.35, 0.4]) {
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

            if (res && res.data) {
              console.log("\n==========================================");
              console.log("SUCCESS_EMVCO_QRIS_STRING:");
              console.log(res.data);
              console.log("==========================================\n");
              return;
            }
          } catch (e) {
            // ignore
          }
        }
      }
    }
    console.log("Failed all angles.");
  } catch (err) {
    console.error("Error:", err);
  }
}

decodeMultiAngle();
