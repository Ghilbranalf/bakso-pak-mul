/**
 * Pure TypeScript EMVCo Dynamic QRIS Generator & CRC16 Checksum Utility
 * Bakso Pak Mul Official Payment System
 */

// Calculate CRC16 CCITT-FALSE (Polynomial: 0x1021, Initial: 0xFFFF)
export function calculateCRC16(str: string): string {
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

/**
 * Converts a static EMVCo QRIS string into a Dynamic QRIS string with exact nominal amount
 * @param staticQrisString Raw EMVCo QRIS string decoded from NMID poster
 * @param amount Total bill in Rupiah (e.g. 12100)
 * @returns Dynamic EMVCo QRIS string with updated CRC16 checksum
 */
export function generateDynamicQRIS(staticQrisString: string, amount: number): string {
  if (!staticQrisString) return "";

  // Remove existing CRC16 (Tag 63) if present at the end
  let qris = staticQrisString;
  const crcIndex = qris.lastIndexOf("6304");
  if (crcIndex !== -1) {
    qris = qris.substring(0, crcIndex);
  }

  // 1. Convert Point of Initiation Method (Tag 01) from 11 (Static) to 12 (Dynamic)
  if (qris.includes("010211")) {
    qris = qris.replace("010211", "010212");
  }

  // 2. Format Amount (Tag 54)
  const amountStr = Math.round(amount).toString();
  const amountTag = `54${amountStr.length.toString().padStart(2, "0")}${amountStr}`;

  // Insert or update Tag 54 before Tag 58 (Country Code '5802ID')
  const tag58Index = qris.indexOf("5802ID");
  if (tag58Index !== -1) {
    // Check if tag 54 already exists before 58
    const tag54Match = qris.match(/54\d{2}\d+/);
    if (tag54Match) {
      qris = qris.replace(tag54Match[0], amountTag);
    } else {
      qris = qris.substring(0, tag58Index) + amountTag + qris.substring(tag58Index);
    }
  } else {
    qris += amountTag;
  }

  // 3. Append Tag 6304 and recalculate CRC16
  qris += "6304";
  const crc = calculateCRC16(qris);
  return qris + crc;
}

/**
 * Fallback static QRIS payload structure for Bakso Pak Mul (NMID: ID1026563066301)
 */
export const DEFAULT_BAKSO_PAK_MUL_STATIC_QRIS =
  process.env.QRIS_STATIC_STRING ||
  "00020101021126670016COM.GO-JEK.WWW011893600914302656306630102152010265630663010303UKE5204581253033605802ID5913Bakso Pak Mul6006Brebes6304";
