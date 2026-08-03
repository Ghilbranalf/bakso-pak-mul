/**
 * Pure TypeScript EMVCo Dynamic QRIS Generator & CRC16 Checksum Utility
 * Bakso Pak Mul Official Payment System
 *
 * QRIS Standard: EMVCo QR Code Specification for Payment Systems (Merchant-Presented Mode)
 * Reference: https://www.emvco.com/specifications/emv-qr-code-specification-for-payment-systems-merchant-presented-mode/
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
 * Parse an EMVCo TLV (Tag-Length-Value) string into an ordered array of tags.
 * Returns array of { tag, length, value } preserving original order.
 */
function parseTLV(data: string): { tag: string; length: number; value: string }[] {
  const result: { tag: string; length: number; value: string }[] = [];
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

/**
 * Serialize an array of TLV objects back to an EMVCo string
 */
function serializeTLV(tags: { tag: string; length: number; value: string }[]): string {
  return tags
    .map((t) => `${t.tag}${t.value.length.toString().padStart(2, "0")}${t.value}`)
    .join("");
}

/**
 * Converts a static EMVCo QRIS string into a Dynamic QRIS string with exact nominal amount.
 *
 * Changes made:
 *  1. Tag 01 (Point of Initiation Method): 11 → 12 (Dynamic)
 *  2. Tag 54 (Transaction Amount): inserted/replaced with the exact amount
 *  3. Tag 63 (CRC16): recalculated
 *
 * @param staticQrisString Raw EMVCo QRIS string decoded from NMID poster
 * @param amount Total bill in Rupiah (e.g. 12100)
 * @returns Dynamic EMVCo QRIS string with updated CRC16 checksum
 */
export function generateDynamicQRIS(staticQrisString: string, amount: number): string {
  if (!staticQrisString) return "";

  // 1. Parse TLV structure
  const tags = parseTLV(staticQrisString);
  if (tags.length === 0) return "";

  // 2. Modify Tag 01 (Point of Initiation Method): 11 (Static) → 12 (Dynamic)
  const tag01 = tags.find((t) => t.tag === "01");
  if (tag01) {
    tag01.value = "12";
  }

  // 3. Remove existing CRC (Tag 63) — we'll recalculate
  const tagsNoCRC = tags.filter((t) => t.tag !== "63");

  // 4. Remove existing Tag 54 if present
  const tagsNoAmount = tagsNoCRC.filter((t) => t.tag !== "54");

  // 5. Format the amount
  const amountStr = Math.round(amount).toString();

  // 6. Insert Tag 54 (Transaction Amount) in the correct position
  //    EMVCo order: ... 52(MCC) 53(Currency) 54(Amount) 55(Tip) 58(Country) ...
  //    We insert before Tag 58 (Country Code) if present, otherwise before Tag 59/60/61/62
  const insertBeforeTags = ["58", "59", "60", "61", "62"];
  let insertIdx = tagsNoAmount.length; // default: append at end (before CRC)
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

  // 7. Serialize and append CRC placeholder
  let qris = serializeTLV(tagsNoAmount) + "6304";

  // 8. Calculate CRC16 and append
  const crc = calculateCRC16(qris);
  return qris + crc;
}

/**
 * Decoded static QRIS payload for Bakso Pak Mul (NMID: ID1026563066301)
 * Acquired by scanning original merchant QRIS poster via jsQR decode.
 *
 * Issuer: DANA (ID.DANA.WWW), Terminal: 0337455850
 * QRIS Tag 51 Acquirer: ID.CO.QRIS.WWW → ID1026563066301
 * MCC: 5499 (Miscellaneous Food Stores), Currency: 360 (IDR)
 * Merchant: "Bakso Pak Mul", City: "Kota Jakarta Ti", Postal: 13510
 */
export const DEFAULT_BAKSO_PAK_MUL_STATIC_QRIS =
  process.env.QRIS_STATIC_STRING ||
  "00020101021126570011ID.DANA.WWW011893600915303374558502090337455850303UMI51440014ID.CO.QRIS.WWW0215ID10265630663010303UMI5204549953033605802ID5913Bakso Pak Mul6015Kota Jakarta Ti61051351063041F15";
