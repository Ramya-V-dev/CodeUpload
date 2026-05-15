const config = require("../DBCONFIG/dbConfig");
const db = require("odbc");
const axios = require("axios");
const qs = require("qs"); // Import this for URL encoding
const pdfParse = require('pdf-parse');
const fs = require('fs');
// const { rtfToText } = require("rtf-parser");
// const rtfParser = require('rtf-parser')
const rtf2text = require('rtf2text');


const Manuallpulldata = async (req, res) => {
  try {
    const connectionString = `Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`;
    const connection = await db.connect(connectionString);

    const getall =
      await connection.query(`select * from Vw_rxqPatient a with(nolock)
        order by a.GlobalId desc , a.PatientName asc ,a.DateOfBirth`);

    // Close the connection
    await connection.close();

    // Send JSON data as response
    res.status(200).json({
      // status: 'Success',
      message: "Data fetched successfully.",
      data: getall,
    });
  } catch (error) {
    console.log("Db not connected :", error);
  }
};

const pulldata = async (req, res) => {
  try {
    const data = req.body;
    let result = "";
    let result1 = "";
    let PatientIdentifier1 = "";
    // const {name} = req.body
    // console.log("data from pull:",data)

    const connectionString = `Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`;
    const connection = await db.connect(connectionString);
    //  const {updatedTableData} = data;
    // const user = data.name;
    // console.log(user);
    // const keys = Object.keys(data);
    // console.log(name);
    const user = data.name;

    const {
      GlobalId,
      SSN,
      PatientName,
      DisplayName,
      DateOfBirth,
      street,
      city,
      state,
      zip,
      Phone,
      Phone2,
      MediAssist,
      PatientIdentifier,
    } = data.row;

    PatientIdentifier1 = PatientIdentifier;

    // Delete from the medication list
    // const query = `insert into PatientView(
    //   GlobalId,SSN,PatientName,DateOfBirth,street,city,state,zip,Phone
    //   ,Queuename,RecordCreatedBy
    //   ,RecordCreatedDate,RecordModifiedBy,RecordModifiedDate
    //   ,PatientIdentifier,IsManualPull)
    //   values (?, ?, ?, CONVERT(DATE, ?, 120), ? ,?, ?, ?, ?, 'ManuallPULL',
    //   'SS_Manuall', GETDATE(), ?, GETDATE(), ?, 1) `;

    const query = `INSERT INTO PatientView (
            GlobalId, SSN, PatientName, DisplayName, DateOfBirth, Street, City, State, zip, Phone, Phone2, MediAssist,
            Queuename, RecordCreatedBy, RecordCreatedDate, RecordModifiedBy, RecordModifiedDate, 
            PatientIdentifier, IsManualPull
        ) VALUES (?, ?, ?, ?, CONVERT(DATE, ?, 120), ?, ?, ?, ?, ?,?, ?, 'Manual Pull', ?, 
            GETDATE(), ?, GETDATE(), ?, 1)`;

    // // Log parameter values for debugging
    //  console.log('Parameters:', [
    //      GlobalId, SSN, PatientName, DisplayName,DateOfBirth
    //     ,street
    //     ,city
    //     ,state
    //     ,zip
    //     ,Phone,MediAssist,user, user, PatientIdentifier
    //  ]);

    // Execute the query directly using connection.query
    result = await connection.query(query, [
      GlobalId,
      SSN,
      PatientName,
      DisplayName,
      DateOfBirth,
      street,
      city,
      state,
      zip,
      Phone,
      Phone2,
      MediAssist,
      user,
      user,
      PatientIdentifier,
    ]);

    const querypml = "select * from PatientView where PatientIdentifier = ? ";
    result1 = await connection.query(querypml, [PatientIdentifier1]);
    // console.log(result1)

    if (result) {
      res.status(200).json({
        data: result1,
        // message: 'Data inserted successfully.'
      });
    } else {
      throw new Error("Failed to insert data into database.");
    }

    await connection.close();

    // try end here
  } catch (error) {
    console.error("Error Updating data:", error);
    res.status(500).json({
      message: "Failed to insert data into database.",
      error: error.message,
    });
  }
};

//  const CsvpdfFile= async (req,res)=> {
//         // const table = req.body
//     try {
//        const connectionString =`Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`
//         const connection = await db.connect(connectionString);
  
  
//        const pdfUrl = 'https://www.cvsspecialty.com/content/dam/enterprise/specialty/pdfs/SpecialtyDrugs.pdf';
//     const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });

//     // Step 2: Parse PDF content
//     const pdfData = await pdfParse(response.data);
//     const fullText = pdfData.text;

//     // Step 3: Extract rows that look like table data
//     const tableData = extractTableData(fullText);
//     console.log('Parsed Table Rows:', tableData.length);

//     // Step 4: Insert into DB
//     // const db = await odbc.connect(connectionString);
//     for (const row of tableData) {
//       const { TherapyClass, BrandName, GenericName } = row;
//       const query = `INSERT INTO CsvFlile (TherapyClass, BrandName, GenericName) VALUES (?, ?, ?)`;
//       await connection.query(query, [TherapyClass, BrandName, GenericName]);
//     }

//     await connection.close();
//     res.json({ success: true, inserted: tableData.length });

//   } catch (err) {
//     console.error('Error:', err);
//     res.status(500).json({ error: 'Failed to extract or insert data' });
//   }
//   }


//   function extractTableData(text) {
//   const lines = text.split('\n').map(line => line.trim()).filter(line => line);
//   const result = [];
//   let inTable = false;
//   let currentRow = { TherapyClass: '', BrandName: '', GenericName: '' };
//   let expectedNext = 'therapy'; // therapy -> brand -> generic
  
//   for (let i = 0; i < lines.length; i++) {
//     const line = lines[i];
    
//     // Detect table start
//     if (!inTable && line.toLowerCase().includes('therapy class')) {
//       inTable = true;
//       continue;
//     }
    
//     // Detect table end
//     if (inTable && line.toLowerCase().includes('*indicates')) {
//       if (currentRow.TherapyClass && currentRow.BrandName) {
//         result.push({...currentRow});
//       }
//       break;
//     }
    
//     if (inTable && line.length > 2) {
//       // Skip header and footer lines
//       if (line.includes('CVS') || line.includes('All rights reserved')) {
//         continue;
//       }
      
//       if (expectedNext === 'therapy' ) {
//         // Save previous row if complete
//         if (currentRow.TherapyClass && currentRow.BrandName) {
//           result.push({...currentRow});
//         }
//         // Start new row
//         currentRow = { TherapyClass: line, BrandName: '', GenericName: '' };
//         expectedNext = 'brand';
//       } else if (expectedNext === 'brand' ) {
//         currentRow.BrandName = line;
//         expectedNext = 'generic';
//       } else if (expectedNext === 'generic' ) {
//         currentRow.GenericName = line;
//         expectedNext = 'therapy';
//       }
//     }
//   }
  
//   return result;
// }


const PDF_URL = 'https://www.cvsspecialty.com/content/dam/enterprise/specialty/pdfs/SpecialtyDrugs.pdf';
const PDF_FILE = 'SpecialtyDrugs.pdf';

// Download PDF
async function downloadPDF() {
  const response = await axios.get(PDF_URL, { responseType: 'arraybuffer' });
  fs.writeFileSync(PDF_FILE, response.data);
}

// Extract table data
 const extractTableData = async () => {
  const dataBuffer = fs.readFileSync(PDF_FILE);
  const data = await pdfParse(dataBuffer);

  const lines = data.text.split('\n').map(line => line.trim());
  const tableRows = [];
  let capture = false;

  for (const line of lines) {
    if (
      line.toLowerCase().includes('therapy class') &&
      line.toLowerCase().includes('brand name') &&
      line.toLowerCase().includes('generic name')
    ) {
      capture = true;
      continue;
    }
    if (!capture) continue;
    if (!line) continue;
    if (capture) console.log(line);

    const cols = line.split(/\s{2,}/).map(col => col.trim());
    if (cols.length >= 3) {
      tableRows.push({
        Therapy: cols[0],
        Brand: cols[1],
        Generic: cols[2]
      });
    }
  }
  return tableRows;
}


// Insert data into SQL Server via ODBC
const insertIntoDB = async(rows) =>  {
   const connectionString = `Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`;
    const connection = await db.connect(connectionString);
  try {
    for (const row of rows) {
      // Adjust table and column names as needed
      await connection.query(
        `INSERT INTO DrugCsv (TherapyClass, BrandName, GenericName) VALUES (?, ?, ?)`,
        [row.Therapy, row.Brand, row.Generic]
      );
    }
  } finally {
    await connection.close();
  }
}

// REST API endpoint
const CsvpdfFile = async (req, res) => {
  try {
    await downloadPDF();
    const tableRows = await extractTableData();
    if (!tableRows.length) {
      return res.status(400).json({ message: 'No table data found in PDF.' });
    }
    await insertIntoDB(tableRows);
    res.json({ message: 'Table data imported successfully!', count: tableRows.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error importing data', error: err.message });
  }
};


//    function rtfToPlainText(rtf) {
//   return new Promise((resolve, reject) => {
//     parseRTF.string(rtf, (err, doc) => {
//       if (err) return reject(err);

//       console.dir(doc, { depth: null });

//       let text = "";
//       if (doc && doc.content) {
//         doc.content.forEach(item => {
//           if (item.type === "paragraph" && item.content) {
//             text += item.content.map(x => x.value || "").join("") + "\n";
//           }
//         });
//       }
//       resolve(text.trim());
//     });
//   });
// }

function rtfToPlainText(rtf) {
  if (!rtf) return "";
  return rtf
    .replace(/\\par[d]?/g, "\n") // paragraph breaks
      .replace(/\\'[0-9a-fA-F]{2}/g, "") // hex encoded chars
      .replace(/\\[a-z]+\d* ?/g, "") // control words like \b, \fs24
      .replace(/[{}]/g, "") // remove braces
      .replace(/\n\s*\n/g, "\n\n") // collapse empty lines
      .trim();
}

// const rftfiles =  async (req, res) => {
//   const connectionString = `Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`;
//     const connection = await db.connect(connectionString);
//   try {
//     // 1. Connect using ODBC
//     // connection = await odbc.connect(config.connectionString);

//     // 2. Read from table
//   const results = await connection.query(
//       "SELECT cNotesId, TypeKey, CAST(Message AS nvarchar(4000)) AS Message, Source_Indicator FROM rtffilesCSV"
//     );

//     // Convert RTF to plain text for all rows
//     const parsedData = results.map(row => {
//       let plainText;
//       try {
//         plainText = rtfToPlainText(row.Message).trim();
//       } catch (err) {
//         plainText = "";
//       }

//       return {
//         cNotesId: row.cNotesId,
//         TypeKey: row.TypeKey,
//         Source_Indicator: row.Source_Indicator,
//         plainText: plainText
//       };
//     });

//     // await connection.close();

//     res.json({ success: true, data: parsedData });
//   } catch (err) {
//     console.error("ODBC Error:", err);
//     res.status(500).send("Error: " + err.message);
//   } finally {
//     if (connection) {
//       await connection.close();
//     }
//   }
// };

// function rtfToPlainText(rtf) {
//   if (!rtf) return "";

//   return rtf
//     // Remove embedded objects (\objdata ...), (\pict ...), (\*\... groups)
//     .replace(/\\objdata[\s\S]*?}/g, "")
//     .replace(/\\pict[\s\S]*?}/g, "")
//     .replace(/{\\\*[^}]+}/g, "")
//     // Replace \par with real newlines
//     .replace(/\\par[d]?/g, "\n")
//     // Remove hex codes like \'xx
//     .replace(/\\'[0-9a-fA-F]{2}/g, "")
//     // Remove all other RTF control words like \fs24, \lang1033
//     .replace(/\\[a-z]+\d* ?/gi, "")
//     // Remove braces
//     .replace(/[{}]/g, "")
//     // Collapse whitespace
//     .replace(/\s+/g, " ")
//     .replace(/\n\s*\n/g, "\n")
//     .trim();
// }

   const rftfiles =  async (req, res) => {
  const connectionString = `Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`;
    const connection = await db.connect(connectionString);
  try {
    // 1. Connect using ODBC
    // connection = await odbc.connect(config.connectionString);

    // 2. Read from table
     const result = await connection.query(
      "SELECT cNotesId, TypeKey, CAST(Message AS nvarchar(4000)) AS Message, Source_Indicator FROM rtffilesCSV"
    );

    let parsedData = [];

    for (let row of result) {
      // Convert RTF Message to plain text
      // let plainText = await new Promise((resolve) => {
      //   parseRTF.string(row.Message, (err, text) => {
      //     resolve(text || "");
      //   });
      // });
      let plainText = await rtfToPlainText(row.Message || "");

      parsedData.push({
        cNotesId: row.cNotesId,
        typeKeyValue: row.TypeKey,
        text: plainText,
        Source_Indicator: row.Source_Indicator,
      });

      const cNotesIdValue = Number(row.cNotesId) || 0;

      const typeKeyValue = row.TypeKey ? row.TypeKey.toString() : '';
const plainTextValue = plainText ? plainText.toString() : '';
const sourceIndicatorValue = row.Source_Indicator ? row.Source_Indicator.toString() : '';

      // 2. Insert into new table using parameter binding
      await connection.query(
        "INSERT INTO rftfiles_insrt (cNotesId, TypeKey, Message, Source_Indicator) VALUES (?, ?, ?, ?)",
        [cNotesIdValue, typeKeyValue, plainTextValue, sourceIndicatorValue]
      );
    }

    res.json({ success: true, data: parsedData });
  } catch (err) {
    console.error("ODBC Error:", err);
    res.status(500).send("Error: " + err.message);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};


const rftgetdata = async (req, res) => {
  try {
    const connectionString = `Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`;
    const connection = await db.connect(connectionString);

    const getall = await connection.query(
      "SELECT cNotesId, TypeKey, CAST(Message AS nvarchar(4000)) AS Message, Source_Indicator FROM rtffilesCSV"
    );   

    console.log(getall)
    // Close the connection
    await connection.close();

    // Send JSON data as response
    res.status(200).json({
      // status: 'Success',
      message: "Data fetched successfully.",
      data: getall,
    });
  } catch (error) {
    console.log("Db not connected :", error);
  }
};


module.exports = {
  Manuallpulldata,
  pulldata,
  CsvpdfFile,
  rftfiles,
  rftgetdata,
};
