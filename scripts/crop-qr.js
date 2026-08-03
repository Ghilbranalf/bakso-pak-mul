const sharp = require('sharp');

async function cropQR() {
  const imgPath = 'C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\e7c05660-7d62-41d8-90b2-acbc02cbacb0\\media__1785566581289.jpg';
  const meta = await sharp(imgPath).metadata();
  console.log("Original Meta:", meta);

  // If width=793, height=446, let's resize to higher resolution 1600x2200 if it was downscaled
  await sharp(imgPath)
    .resize(1600, 2200, { fit: 'fill' })
    .toFile('d:\\PROJECT\\BAKSO PAK MUL\\bakso-pak-mul\\scripts\\qr-upscaled.png');
  
  console.log("Saved upscaled PNG.");
}

cropQR();
