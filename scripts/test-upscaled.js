const sharp = require('sharp');
const { MultiFormatReader, RGBLuminanceSource, BinaryBitmap, HybridBinarizer } = require('@zxing/library');

async function testUpscaled() {
  try {
    const imgPath = 'd:\\PROJECT\\BAKSO PAK MUL\\bakso-pak-mul\\scripts\\qr-upscaled.png';
    const { data, info } = await sharp(imgPath).raw().toBuffer({ resolveWithObject: true });

    const source = new RGBLuminanceSource(new Uint8ClampedArray(data), info.width, info.height);
    const bitmap = new BinaryBitmap(new HybridBinarizer(source));
    const reader = new MultiFormatReader();
    const result = reader.decode(bitmap);

    console.log("==========================================");
    console.log("SUCCESS_EMVCO_QRIS_STRING:");
    console.log(result.getText());
    console.log("==========================================");
  } catch (err) {
    console.error("ZXing Error:", err.message || err);
  }
}

testUpscaled();
