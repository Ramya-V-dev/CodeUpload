const db = require("odbc");
const config = require("../DBCONFIG/dbConfig");
const fs = require("fs-extra");
const moment = require("moment");
const path = require("path");
require("dotenv").config();

const medlistget = async (req, res) => {
  try {
    //  const connectionString = `server=${config.server};Database=${config.database};Trusted_Connection=Yes;Driver={${config.driver}}`;
    const connectionString = `Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`;
    // const pool = await sql.connect(config);
    const connection = await db.connect(connectionString);

    const { PatientIdentifier } = req.params;

    // console.log('PatientIdentifier',PatientIdentifier)

    const getall = await connection.query(`select *,
        cast(ScriptNumber as varchar(50))+
        case when len(RefillNumber)=1 then '-0' else '-' end +
        cast(RefillNumber as varchar(5)) RX#
        from patientmedicationlist
             where PatientIdentifier = '${PatientIdentifier}' order by PMID desc`);
    // const jsonData = JSON(getall);
    // console.log(getall)
    // Close the connection
    await connection.close();

    // Send JSON data as response
    res.status(200).json({
      message: "Data fetched successfully.",
      data: getall,
    });

    // console.log('data retireved',getall.recordset)
    // return getall;
  } catch (error) {
    console.log("Db not connected :", error);
  }
};

const medlistadd = async (req, res) => {
  try {
    const connectionString = `Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`;
    const connection = await db.connect(connectionString);

    const data = req.body;
    //  const name = req.body

    //  console.log("name",data);
    //  console.log("name from array",data.PatientName)

    // const {selectedData = req.body
    const {
      Globalid,
      SSN,
      DateOfBirth,
      Prescriber,
      Drug_name,
      sigs,
      QuantityDispensed,
      Pharmacy,
      DateDispensedSQL,
      OnHold,
      IsPacked,
      PatientIdentifier,
      NdcNumber,
    } = data.formData;

    // Convert QuantityDispensed to a decimal number
    const QuantityDispensedDecimal = parseFloat(QuantityDispensed);

    // const {name} = req.body;

    const user = data.name;
    // console.log(user)

    // Prepare the SQL query with explicit parameter types
    const query = `
          INSERT INTO PatientMedicationList (
            Globalid, SSN, PatientName,  DateOfBirth, Prescriber, Drug_name, sigs, QuantityDispensed, Pharmacy,
            DateDispensedSQL,  OnHold,RecordCreatedDate, RecordCreatedBy,
            RecordModifiedDate, RecordModifiedBy, DMLType, Source, IsPacked, PatientIdentifier, NdcNumber
          )
          VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, REPLACE(? , '''', ''''), CONVERT(DATE, ?, 120),  ?,GetDate(), ?, GetDate(), ?, 'Insert', 'Manual', ?, ?, ? )
        `;

    // console.log("Parameters:", [
    //   Globalid,
    //   SSN,
    //   data.PatientName,
    //   DateOfBirth,
    //   Prescriber,
    //   Drug_name,
    //   sigs,
    //   QuantityDispensedDecimal,
    //   Pharmacy,
    //   DateDispensedSQL,
    //   OnHold,
    //   user,
    //   user,
    //   IsPacked,
    //   PatientIdentifier,
    //   NdcNumber,
    // ]);

    // Set up request with parameter definitions
    result = await connection.query(query, [
      Globalid,
      SSN,
      data.PatientName,
      DateOfBirth,
      Prescriber,
      Drug_name,
      sigs,
      QuantityDispensedDecimal,
      Pharmacy,
      DateDispensedSQL,
      OnHold,
      user,
      user,
      IsPacked,
      PatientIdentifier,
      NdcNumber,
    ]);

    const querypml =
      "select * from [PatientMedicationList] where PatientIdentifier=? ";
    result1 = await connection.query(querypml, [PatientIdentifier]);

    // Execute the query

    await connection.close();

    // Send JSON data as response

    if (result) {
      res.status(200).json({
        message: "Data fetched successfully.",
        // data:result1
        // name
      });
    }

    //   console.log(name)

    // console.log('data retireved',getall.recordset)
    // return getall;
  } catch (error) {
    console.log("Db not connected :", error);
  }
};

//   const medlistupdate = async (req, res) => {
//     try {
//         const data = req.body
//         let result = '';
//         let result1 = '';
//         let PatientIdentifier1= '';

//         const connectionString = `Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`;
//         const connection = await db.connect(connectionString);

//         // const user = name;
//         // const keys = Object.keys(data);
//         console.log(data.selectedData);

//         for (const a of data ){
//             const {
//                 Drug_name
//                 ,sigs
//                 ,QuantityDispensed
//                 ,Pharmacy
//                 ,DateDispensedSQL
//                 ,Sb_LastModified
//                 ,OnHold
//                 ,IsPacked
//                 ,Globalid
//                 ,SSN
//                 ,PatientName
//                 ,PatientIdentifier,user
//             } = a;

//         PatientIdentifier1 = PatientIdentifier;

//         const QuantityDispensedDecimal = parseFloat(QuantityDispensed);

//         // Delete from the medication list
//         const query = `UPDATE [dbo].[PatientMedicationList]
//         SET
//             [Drug_name] = ?
//            ,[sigs] = ?
//            ,[QuantityDispensed] = ?
//            ,[Pharmacy] = ?
//            ,[DateDispensedSQL] = ?
//            ,[Sb_LastModified] = CONVERT(DATETIME, ?, 120)
//            ,[OnHold] = ?
//            ,[RecordModifiedDate] = getdate()
//            ,[RecordModifiedBy] = ?
//            ,[DMLType] = 'Modified'
//            ,[IsPacked] = ?
//       WHERE [Globalid] = ? and
//            [SSN] = ? and
//            [PatientName] = ? and
//            [PatientIdentifier] = ?`;

//         // Log parameter values for debugging
//         // console.log('Parameters:', [
//         //     Globalid, SSN, PatientName, Drug_name, Sigs, QuantityDispensedDecimal, Pharmacy,
//         //     DateDispensedSQL, Sb_LastModified, OnHold, user, user, PatientIdentifier
//         // ]);

//         // Execute the query directly using connection.query
//          result = await connection.query(query, [Drug_name
//             ,sigs
//             ,QuantityDispensedDecimal
//             ,Pharmacy
//             ,DateDispensedSQL
//             ,Sb_LastModified
//             ,OnHold
//             ,user
//             ,IsPacked
//             ,Globalid
//             ,SSN
//             ,PatientName
//             ,PatientIdentifier

//         ]);

//     }

//     const querypml = 'select * from [PatientMedicationList] where PatientIdentifier=? '
//     result1 = await connection.query(querypml, [PatientIdentifier1]);
//     console.log(result1.length)

//     if (result) {
//         res.status(200).json({
//             data: result1
//             // message: 'Data inserted successfully.'
//         });
//     } else {
//         throw new Error('Failed to insert data into database.');
//     }

//     await connection.close();

//      // try end here

//     }catch (error) {
//         console.error('Error Updating data:', error);
//         res.status(500).json({
//             message: 'Failed to insert data into database.',
//             error: error.message
//         });
//     }
// };

const medlistupdate = async (req, res) => {
  try {
    const data = req.body;
    let result = "";
    let result1 = "";
    let PatientIdentifier1 = "";
    // const {name} = req.body
    // console.log(data)

    const connectionString = `Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`;
    const connection = await db.connect(connectionString);
    //  const {updatedTableData} = data;
    // const user = data.name;
    // console.log(user);
    // const keys = Object.keys(data);
    // console.log(name);

    const {
      PMID,
      Drug_name,
      sigs,
      QuantityDispensed,
      Pharmacy,
      DateDispensedSQL,
      RecordModifiedBy,
      // ,Sb_LastModified
      DateWritten,
      // ,OnHold
      Prescriber,
      IsPacked,
      Reviewed,
      Globalid,
      SSN,
      PatientName,
      PatientIdentifier,
    } = data;

    PatientIdentifier1 = PatientIdentifier;

    const QuantityDispensedDecimal = parseFloat(QuantityDispensed);

    // Delete from the medication list
    const query = `UPDATE [dbo].[PatientMedicationList]
        SET 
            [Drug_name] = REPLACE(? , '''', '''')
           ,[sigs] = REPLACE(? , '''', '''')
           ,[QuantityDispensed] = ?
           ,[Pharmacy] = ?
           ,[DateDispensedSQL] = ?
           ,[DateWritten] = CONVERT(DATETIME, ?, 120)
           ,[Prescriber] = ?
           ,[RecordModifiedDate] = getdate()
           ,[RecordModifiedBy] = ?
           ,[DMLType] = 'Modified'
           ,[IsPacked] = ?
           ,[Reviewed] = ?      
      WHERE [Globalid] = ? and
           [SSN] = ? and
           [PatientName] = ? and
           [PatientIdentifier] = ? and 
           [PMID]=? `;

    // Log parameter values for debugging
    // console.log('Parameters:', [
    //     Globalid, SSN, PatientName, Drug_name, sigs, QuantityDispensedDecimal, Pharmacy,
    //     DateDispensedSQL, Sb_LastModified, OnHold, user, PatientIdentifier
    // ]);

    // Execute the query directly using connection.query
    result = await connection.query(query, [
      Drug_name,
      sigs,
      QuantityDispensedDecimal,
      Pharmacy,
      DateDispensedSQL,
      // ,Sb_LastModified
      DateWritten,
      // ,OnHold
      Prescriber,
      RecordModifiedBy,
      IsPacked,
      Reviewed,
      Globalid,
      SSN,
      PatientName,
      PatientIdentifier,
      PMID,
    ]);

    const querypml =
      "select * from [PatientMedicationList] where PatientIdentifier=? ";
    result1 = await connection.query(querypml, [PatientIdentifier1]);
    // console.log(result1.length)

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

const medlistdelete = async (req, res) => {
  const { PMID, name, Role } = req.body;

  try {
    const connectionString = `Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`;
    const connection = await db.connect(connectionString);
    // const { PMID,name } = req.params;
    // console.log(PMID,'deleted date')
    const query = `EXEC [dbo].[SP_PatientMedicationList_Delete] ?, ?, ?`;
    await connection.query(query, [PMID, name, Role]);
    res.status(200).send({ message: "Record deleted successfully" });
    await connection.close();
  } catch (error) {
    console.error("Error deleting data:", error);
    res
      .status(500)
      .send({ message: "Failed to delete data", error: error.message });
  }
};

const fetchDeletedHistory = async (req, res) => {
  const { PatientIdentifier } = req.params;

  try {
    const connectionString = `Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`;
    const connection = await db.connect(connectionString);
    const query = `SELECT * FROM PatientMedicationList_History WHERE PatientIdentifier = ? AND 
    DMLType = 'Delete' and HistoryCreatedDate >= DATEADD(month, -6,cast(getdate() as date))
    order by PMHID desc`;
    const result = await connection.query(query, [PatientIdentifier]);
    await connection.close();

    res.status(200).send({
      message: "data fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error fetching deleted history data:", error);
    res
      .status(500)
      .send({
        message: "Failed to fetch deleted history data",
        error: error.message,
      });
  }
};

const reviewdata = async (req, res) => {
  const { PMIDs, name, PatientIdentifier, Role } = req.body;
  let successCount = 0;
  let failureCount = 0;
  const failedPMIDs = [];
  let errorLogs = [];

  const logError = (message) => {
    // const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    errorLogs.push(message);
  };

  try {
    const connectionString = `Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`;
    const connection = await db.connect(connectionString);

    for (const PMID of PMIDs) {
      try {
        const query = `UPDATE [dbo].[PatientMedicationList]
          SET 
            [Reviewed] = 'Yes',
            [ReviewedBy] = ?,
            [ReviewedDate] = GetDate(),
            [RecordModifiedBy] = ?,
            [RecordModifiedDate] = GetDate(),
            [DMLType] = 'Modified'   
          WHERE [PMID] = ?`;

        const result = await connection.query(query, [name, name, PMID]);

        console.log(result.count, `updated ${PMID}`);

        if (result.count && result.count > 0) {
          // const procQuery = `EXEC [dbo].[SP_PatientReviewDetailsInsert] @PatientIdentifier = ?`;
          // await connection.query(procQuery, [PatientIdentifier]);
          // console.log(procQuery,'executed')
          successCount++;
        } else {
          failureCount++;
          failedPMIDs.push(PMID);
          logError(`Failed to update PMID ${PMID}`);
        }
      } catch (error) {
        console.error(`Error updating PMID ${PMID}:`, error);

        if (error.odbcErrors && error.odbcErrors.length > 0) {
          // const dbError = error.odbcErrors.find(err => err.code === 11501) || error.odbcErrors[0];
          const dbError = error.odbcErrors[0];

          if (dbError.code === 208) {
            logError(`Error updating PMID ${PMID}: ${dbError.message}`);
          } else if (dbError.code === 207) {
            logError(`Error updating PMID ${PMID}: ${dbError.message}`);
          } else {
            logError(`Error updating PMID ${PMID}: ${dbError.message}`);
          }
        }
        // failureCount++;
        // failedPMIDs.push(PMID);
        // logError(`Error updating PMID ${PMID}: ${error.message}`);
      }
    }

    if (successCount > 0) {
      try {
        const procQuery = `EXEC [dbo].[SP_PatientReviewDetailsInsert] @PatientIdentifier = ?, @Role = ?`;
        await connection.query(procQuery, [PatientIdentifier, Role]);
        console.log(procQuery, "executed");
      } catch (error) {
        console.error("Error executing stored procedure:", error);
        logError(`Error executing stored procedure: ${error.message}`);
      }
    }

    await connection.close();

    if (errorLogs.length > 0) {
      await writeErrorLogs(errorLogs, name);
    }

    res.status(200).json({
      success: true,
      message:
        errorLogs.length > 0
          ? "Review process completed with errors"
          : "Review process completed successfully",
      successCount,
      failureCount,
      failedPMIDs,
    });

    // res.status(200).json({
    //   success: true,
    //   message: 'Review process completed',
    //   successCount,
    //   failureCount,
    //   failedPMIDs
    // });
  } catch (error) {
    console.error("Error in reviewdata:", error);
    logError(`Error in reviewdata: ${error.message}`);
    await writeErrorLogs(errorLogs, name);

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// async function writeErrorLogs(errorLogs) {
//   const logDir = 'C:\\Users\\ramyav\\ErrorLog';
//   await fs.ensureDir(logDir);
//   const fileName = `error_log_${moment().format('YYYY-MM-DD_HH-mm-ss')}.txt`;
//   const filePath = path.join(logDir, fileName);
//   await fs.writeFile(filePath, errorLogs.join('\n'));
//   console.log(`Error log written to ${filePath}`);
// }

const ErrLogFile = process.env.REVIEW_ERROR_LOG;
//  console.log(process.env.REVIEW_ERROR_LOG,'log')

async function writeErrorLogs(errorLogs, name) {
  const logDir = `${ErrLogFile}`;
  const fileName = "error_log.txt";
  const filePath = path.join(logDir, fileName);

  // Ensure the directory exists
  await fs.ensureDir(logDir);

  // Format the new error logs with date and time
  const formattedLogs = errorLogs.map(
    (log) => `[${moment().format("YYYY-MM-DD HH:mm:ss")}] User:${name} ${log}`
  );

  try {
    // Check if the file exists
    const fileExists = await fs.pathExists(filePath);

    if (fileExists) {
      // If file exists, append the new logs
      await fs.appendFile(filePath, "\n" + formattedLogs.join("\n"));
    } else {
      // If file doesn't exist, create it with the new logs
      await fs.writeFile(filePath, formattedLogs.join("\n"));
    }

    console.log(`Error log appended to ${filePath}`);
  } catch (error) {
    console.error("Error writing to log file:", error);
  }
}

const packdata = async (req, res) => {
  const { PMIDs, name } = req.body;
  let successCount = 0;
  let failureCount = 0;
  const failedPMIDs = [];

  try {
    const connectionString = `Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`;
    const connection = await db.connect(connectionString);

    for (const PMID of PMIDs) {
      try {
        const query = `UPDATE [dbo].[PatientMedicationList]
              SET 
                   [IsPacked] = 'Yes'
                   ,[RecordModifiedBy] = ?
                   ,[RecordModifiedDate] = GetDate()
                 ,[DMLType] = 'Modified'   
            WHERE [PMID]=?  `;

        const result = await connection.query(query, [name, PMID]);

        console.log(result.count, `updatedPack ${PMID}`);

        if (result.count && result.count > 0) {
          successCount++;
        } else {
          failureCount++;
          failedPMIDs.push(PMID);
        }
      } catch (error) {
        console.error(`Error updating PMID ${PMID}:`, error);
        failureCount++;
        failedPMIDs.push(PMID);
      }
    }

    await connection.close();

    res.status(200).json({
      success: true,
      message: "Review process completed",
      successCount,
      failureCount,
      failedPMIDs,
    });
  } catch (error) {
    console.error("Error in reviewdata:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


const Drug_List = async (req, res) => {
  try {
    const connectionString = `Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`;
    const connection = await db.connect(connectionString);

    const getall = await connection.query(
      "SELECT * FROM  DrugMaster order by DrugName"
    );   

    // console.log(getall)
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

const Prov_List = async (req, res) => {
  try {
    const connectionString = `Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`;
    const connection = await db.connect(connectionString);

    const getall = await connection.query(
      "SELECT * FROM PrescriberMaster order by Prescriber"
    );   

    // console.log(getall)
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
  medlistget,
  medlistadd,
  medlistupdate,
  medlistdelete,
  fetchDeletedHistory,
  reviewdata,
  packdata,
  Drug_List,
  Prov_List
};
