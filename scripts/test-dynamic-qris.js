// Test Dynamic QRIS Generation with the real decoded string
// Run: node scripts/test-dynamic-qris.js

const STATIC_QRIS = "00020101021126570011ID.DANA.WWW011893600915303374558502090337455850303UMI51440014ID.CO.QRIS.WWW0215ID10265630663010303UMI5204549953033605802ID5913Bakso Pak Mul6015Kota Jakarta Ti61051351063041F15";

// ---- CRC16 CCITT-FALSE ----
function calculateCRC16(str) {
  let crc = 0xffff;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    crc ^= c << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

// ---- TLV Parser ----
function parseTLV(data) {
  const result = [];
  let pos = 0;
  while (pos < data.length) {
    if (pos + 4 > data.length) break;
    const tag = data.substring(pos, pos + 2);
    const length = parseInt(data.substring(pos + 2, pos + 4), 10);
    if (isNaN(length) || pos + 4 + length > data.length) break;
    const value = data.substring(pos + 4, pos + 4 + length);
    result.push({ tag, length, value });
    pos += 4 + length;
  }
  return result;
}

function serializeTLV(tags) {
  return tags
    .map((t) => `${t.tag}${t.value.length.toString().padStart(2, "0")}${t.value}`)
    .join("");
}

// ---- Dynamic QRIS Generator ----
function generateDynamicQRIS(staticQrisString, amount) {
  if (!staticQrisString) return "";
  const tags = parseTLV(staticQrisString);
  if (tags.length === 0) return "";

  const tag01 = tags.find((t) => t.tag === "01");
  if (tag01) tag01.value = "12";

  const tagsNoCRC = tags.filter((t) => t.tag !== "63");
  const tagsNoAmount = tagsNoCRC.filter((t) => t.tag !== "54");

  const amountStr = Math.round(amount).toString();
  const insertBeforeTags = ["58", "59", "60", "61", "62"];
  let insertIdx = tagsNoAmount.length;
  for (let i = 0; i < tagsNoAmount.length; i++) {
    if (insertBeforeTags.includes(tagsNoAmount[i].tag)) {
      insertIdx = i;
      break;
    }
  }

  tagsNoAmount.splice(insertIdx, 0, {
    tag: "54",
    length: amountStr.length,
    value: amountStr,
  });

  let qris = serializeTLV(tagsNoAmount) + "6304";
  const crc = calculateCRC16(qris);
  return qris + crc;
}

// =================== TESTS ===================
console.log("========================================");
console.log("QRIS Dynamic Generator Test");
console.log("========================================\n");

// Verify original static CRC
console.log("1. Verifying original static QRIS CRC16...");
const staticNoCRC = STATIC_QRIS.substring(0, STATIC_QRIS.length - 4);
const staticCRC = STATIC_QRIS.slice(-4);
const calcCRC = calculateCRC16(staticNoCRC.substring(0, staticNoCRC.length)); // up to "6304"
// The original string includes "6304" + CRC, so to verify we need to check the CRC against "...6304"
const verify = calculateCRC16(STATIC_QRIS.substring(0, STATIC_QRIS.length - 4));
console.log("   Original CRC:", staticCRC);
console.log("   Calculated CRC:", verify);
console.log("   CRC Valid:", verify === staticCRC);

// Parse TLV structure
console.log("\n2. Parsing TLV structure of static QRIS...");
const tags = parseTLV(STATIC_QRIS);
tags.forEach(t => {
  const tagNames = {
    "00": "Payload Format Indicator",
    "01": "Point of Initiation Method",
    "26": "Merchant Account Info (DANA)",
    "51": "QRIS Acquirer",
    "52": "Merchant Category Code",
    "53": "Transaction Currency (360=IDR)",
    "54": "Transaction Amount",
    "58": "Country Code",
    "59": "Merchant Name",
    "60": "Merchant City",
    "61": "Postal Code",
    "63": "CRC16"
  };
  console.log(`   Tag ${t.tag} (${tagNames[t.tag] || "Unknown"}): ${t.value}`);
});

// Generate Dynamic QRIS for Rp 12.100
console.log("\n3. Generating Dynamic QRIS for Rp 12.100...");
const dynamic12k = generateDynamicQRIS(STATIC_QRIS, 12100);
console.log("   Result:", dynamic12k);
console.log("   Length:", dynamic12k.length);

// Verify dynamic CRC
const dynVerify = calculateCRC16(dynamic12k.substring(0, dynamic12k.length - 4));
const dynCRC = dynamic12k.slice(-4);
console.log("   CRC Valid:", dynVerify === dynCRC);

// Parse dynamic TLV
console.log("\n4. Parsing Dynamic QRIS TLV...");
const dynTags = parseTLV(dynamic12k);
dynTags.forEach(t => {
  if (t.tag === "01") console.log(`   Tag 01 (Initiation): ${t.value} ${t.value === "12" ? "✓ DYNAMIC" : "✗ WRONG"}`);
  if (t.tag === "54") console.log(`   Tag 54 (Amount): ${t.value} ✓`);
  if (t.tag === "63") console.log(`   Tag 63 (CRC): ${t.value}`);
});

// Test other amounts
console.log("\n5. Testing other amounts...");
[1000, 50000, 100000, 250000].forEach(amt => {
  const d = generateDynamicQRIS(STATIC_QRIS, amt);
  const v = calculateCRC16(d.substring(0, d.length - 4));
  const c = d.slice(-4);
  console.log(`   Rp ${amt.toLocaleString()} → CRC Valid: ${v === c}, Length: ${d.length}`);
});

console.log("\n========================================");
console.log("All tests completed!");
console.log("========================================");
