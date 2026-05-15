const config = require("../DBCONFIG/dbConfig");
const db = require("odbc");

const Libertyget = async (req, res) => {
  try {
    const connectionString = `Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`;
    const connection = await db.connect(connectionString);
    const { PatientIdentifier } = req.params;
    // const PatientIdentifier = identify.PatientIdentifier;
    // console.log('identifier',PatientIdentifier);
    // const sp = `exec  Usp_LibertyMedicationList_CompPack_Get  '?'`

    const result =
      await connection.query(`exec  Usp_LibertyMedicationList_CompPack_Get  '${PatientIdentifier}' 
                    `);
    // console.log('result',result)

    await connection.close();

    // Send JSON data as response ${identify.PatientIdentifier}

    res.status(200).json({
      message: "Data fetched successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Error executing SQL query:", error);
    res.status(500).json({
      message: "Failed to fetch data from database.",
      error: error.message,
    });
  }
};

const LibertygetAll = async (req, res) => {
  try {
    const connectionString = `Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`;
    const connection = await db.connect(connectionString);
    const { PatientIdentifier } = req.params;
    // const PatientIdentifier = identify.PatientIdentifier;
    // console.log('identifier',PatientIdentifier);
    // const sp = `exec  Usp_LibertyMedicationList_CompPack_Get  '?'`

    const result =
      await connection.query(`exec  Usp_TotalLibertyMedicationList_CompPack_GetAll  '${PatientIdentifier}' 
                    `);
    // console.log('result',result)

    await connection.close();

    // Send JSON data as response ${identify.PatientIdentifier}

    res.status(200).json({
      message: "Data fetched successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Error executing SQL query:", error);
    res.status(500).json({
      message: "Failed to fetch data from database.",
      error: error.message,
    });
  }
};

//

const LibertyExport = async (req, res) => {
  try {
    const data = req.body;
    const { name } = req.body;
    let result = "";
    let result1 = "";
    let PatientIdentifier1 = "";

    const connectionString = `Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`;
    const connection = await db.connect(connectionString);

    const user = name;
    // const keys = Object.keys(data);
    // console.log(data.selectedData);

    for (const a of data.selectedData) {
      const {
        Globalid,
        SSN,
        PatientName,
        DateOfBirth,
        Drug_name,
        Sigs,
        QuantityDispensed,
        Pharmacy,
        DateDispensedSQL,
        Sb_LastModified,
        DateWritten,
        ScriptNumber,
        cScriptTransactionId,
        OnHold,
        Prescriber,
        PatientIdentifier,
        NdcNumber,
        RefillNumber,
      } = a;

      PatientIdentifier1 = PatientIdentifier;

      // Convert QuantityDispensed to a decimal number
      const QuantityDispensedDecimal = parseFloat(QuantityDispensed);

      // Prepare the SQL query with parameterized values
      const query = `
            INSERT INTO PatientMedicationList (
                Globalid, SSN, PatientName,DateOfBirth, Drug_name, sigs, QuantityDispensed, Pharmacy,
                DateDispensedSQL, Sb_LastModified, DateWritten,ScriptNumber,cScriptTransactionId, OnHold, Prescriber, RecordCreatedDate, RecordCreatedBy,
                RecordModifiedDate, RecordModifiedBy, DMLType, Source, IsPacked, PatientIdentifier,NdcNumber, RefillNumber
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, CONVERT(DATETIME, ?, 120), CONVERT(DATETIME, ?, 120), CONVERT(DATETIME, ?, 120),?,?, ?, ?, GETDATE(), ?, GETDATE(), ?, 'Insert', 'Liberty', 'No', ?, ?, ?)
        `;

      // Log parameter values for debugging
      // console.log('Parameters:', [
      //     Globalid, SSN, PatientName, Drug_name, Sigs, QuantityDispensedDecimal, Pharmacy,
      //     DateDispensedSQL, Sb_LastModified, OnHold, user, user, PatientIdentifier
      // ]);

      // Execute the query directly using connection.query
      result = await connection.query(query, [
        Globalid,
        SSN,
        PatientName,
        DateOfBirth,
        Drug_name,
        Sigs,
        QuantityDispensedDecimal,
        Pharmacy,
        DateDispensedSQL,
        Sb_LastModified,
        DateWritten,
        ScriptNumber,
        cScriptTransactionId,
        OnHold,
        Prescriber,
        user,
        user,
        PatientIdentifier,
        NdcNumber,
        RefillNumber,
      ]);
    }

    const querypml =
      "select * from [PatientMedicationList] where PatientIdentifier=? ";
    result1 = await connection.query(querypml, [PatientIdentifier1]);

    if (result) {
      res.status(200).json({
        data: result1,
        // message: 'Data inserted successfully.'
      });
    } else if ((result = "")) {
      // throw new Error('Failed to insert data into database.');
      res.status(201).json({ message: "data not avaliable and checked" });
      // alert('data not selected')
    }

    await connection.close();

    // try end here
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({
      message: "Failed to insert data into database.",
      error: error.message,
    });
  }
};

module.exports = { Libertyget, LibertyExport, LibertygetAll };
