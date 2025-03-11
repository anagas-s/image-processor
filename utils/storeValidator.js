// utils/storeValidator.js
const fs = require("fs");
const csv = require("csv-parser");

const storeMaster = [];

fs.createReadStream("StoreMasterAssignment.csv")
  // utils/storeValidator.js
  .pipe(
    csv({
      separator: ",",
      headers: ["area_code", "store_name", "store_id"], // Match CSV headers exactly
      renameHeaders: false, // Disable auto-renaming
    })
  )
  // utils/storeValidator.js
  // utils/storeValidator.js
  .on("data", (row) => {
    // Fix store_id truncation (e.g., RP012477000129 → RP01247)
    const cleanStoreId = row.store_id
      .trim()
      .replace(/["',|\s]/g, "")
      .replace(/(\d{7})\d+/, "$1") // Keep first 7 digits (RP00001 format)
      .toUpperCase();

    storeMaster.push({
      store_id: cleanStoreId,
      store_name: row.store_name.trim().replace(/["']/g, ""),
      area_code: row.area_code.trim().replace(/["']/g, ""),
    });
  })
  .on("end", () => {
    console.log(`Loaded ${storeMaster.length} stores`);
  })
  .on("error", (err) => {
    console.error("CSV parsing error:", err);
    process.exit(1);
  });

const isValidStore = (storeId) => {
  return storeMaster.some((store) => store.store_id === storeId);
};

module.exports = { isValidStore };
