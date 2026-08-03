const fs = require('fs');
const sharp = require('sharp');
const { MultiFormatReader, RGBLuminanceSource, BinaryBitmap, HybridBinarizer } = require('@zxing/library');

async function decodeZXing() {
  try {
    const imgPath = 'C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\e7c05660-7d62-41d8-90b2-acbc02cbacb0\\media__1785566581289.jpg';
    const { data, info } = await sharp(imgPath)
      .raw()
      .toBuffer({ resolveWithObject: true });

    const luminanceSource = new RGBLuminanceSource(new Uint8ClampedArray(data), info.width, info.height);
    const binaryBitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));
    
    const reader = new MultiFormatReader();
    const result = reader.decode(binaryBitmap);

    console.log("==========================================");
    console.log("SUCCESS_EMVCO_QRIS_STRING:");
    console.log(result.getText());
    console.log("==========================================");
  } catch (err) {
    console.error("ZXing Error:", err.message || err);
  }
}

decodeZXing();
