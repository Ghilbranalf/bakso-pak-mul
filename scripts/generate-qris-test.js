const { generateDynamicQRIS, calculateCRC16 } = require('../src/lib/qris.ts');

const staticQris = "00020101021126670016COM.GO-JEK.WWW011893600914302656306630102152010265630663010303UKE5204581253033605802ID5913Bakso Pak Mul6006Brebes6304";

console.log("--------------------------------------------------");
console.log("TEST 1: Generate Dynamic QRIS for Rp 1.000");
const dynamic1k = generateDynamicQRIS(staticQris, 1000);
console.log("Result Rp 1.000:", dynamic1k);
console.log("CRC16 Validated:", calculateCRC16(dynamic1k.substring(0, dynamic1k.length - 4)) === dynamic1k.slice(-4));

console.log("\nTEST 2: Generate Dynamic QRIS for Rp 12.100");
const dynamic12k = generateDynamicQRIS(staticQris, 12100);
console.log("Result Rp 12.100:", dynamic12k);
console.log("CRC16 Validated:", calculateCRC16(dynamic12k.substring(0, dynamic12k.length - 4)) === dynamic12k.slice(-4));
console.log("--------------------------------------------------");
