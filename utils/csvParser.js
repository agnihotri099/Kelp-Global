// const fs = require("fs");
// const parseCSV = (filePath) => {
//   return new Promise((resolve, reject) => {
//     fs.readFile(filePath, "utf8", (err, data) => {
//       if (err) reject(err);

//       const rows = data.split("\n");
//       const headers = rows[0].split(",");
//       const jsonResult = [];

//       for (let i = 1; i < rows.length; i++) {
//         const row = {};
//         const rowData = rows[i].split(",");
//         for (let j = 0; j < headers.length; j++) {
//           // Safely access rowData[j], defaulting to an empty string if undefined
//           const columnValue = rowData[j] || "";
//           const trimmedValue = columnValue.trim();
//           const propertyName = headers[j].trim();
//           const nestedKeys = propertyName.split(".");
//           let currentLevel = row;

//           nestedKeys.forEach((key, index) => {
//             if (index === nestedKeys.length - 1) {
//               currentLevel[key] = trimmedValue;
//             } else {
//               currentLevel[key] = currentLevel[key] || {};
//               currentLevel = currentLevel[key];
//             }
//           });
//         }
//         jsonResult.push(row);
//       }

//       resolve(jsonResult);
//     });
//   });
// };

// module.exports = { parseCSV };





// For infinite depth data we need to use csv-parser it will
//easily accomodate stream


const fs = require('fs');
const csvParser = require('csv-parser'); 

function parseCSV(filePath) {
  const results = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data) => {
        const parsedData = parseNestedProperties(data);
        results.push(parsedData);
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', reject);
  });
}

function parseNestedProperties(data) {
  const result = {};

  for (const [key, value] of Object.entries(data)) {
    const keys = key.split('.');
    let current = result;

    keys.forEach((keyPart, index) => {
      if (index === keys.length - 1) {
        current[keyPart] = value;
      } else {
        if (!current[keyPart]) current[keyPart] = {};
        current = current[keyPart];
      }
    });
  }

  return result;
}

module.exports = { parseCSV };

