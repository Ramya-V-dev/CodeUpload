

// const sql = require('mssql');
 
// // Configuration for the SQL Server connection
// const config = {
//   server: 'PPLUSDW',  // Replace with the actual server name or IP address of server 42
//   database: 'TrainingDB',
//   user:'PP_Liberty',
//   password:'PrimaryPlus@12',
//   port:1433,
//   options: {
//     // trustedConnection: true,  // Use Windows authentication
//     trustServerCertificate: true,
//     encrypt: true,
//   },
// };
 
// // Connect to SQL Server
// async function testDatabaseConnection() {
//   try {
//     // Try to connect to the database
//     const pool = await sql.connect(config);
//     const getall=await pool.request().query('SELECT * FROM PatientMedicationList')
//     console.log('data retrieved',getall.recordset)
//     // If the connection is successful, log a message
//     console.log('Connected to the database');

//     // Close the connection
//     await pool.close();
//   } catch (error) {
//     // If there is an error, log the error message
//     console.error('Error connecting to the database:', error.message);
//   }
// }

// // Call the function to test the database connection
// testDatabaseConnection()


// const db = require('odbc')
// const connectionString = "server=PPLUSDW;Database=TrainingDB;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}";
// db.connect(connectionString, (err,connection) => {
//   if (err) {
//     throw err;
//   }connection.query('SELECT * FROM PatientView', (err, rows) => {
//     if (err) {
//       throw err;
//     }

//     console.log(rows);

//     db.close();
//   });
// });
 
//---------------------------------------------------------

// const sql = require('mssql/msnodesqlv8');
// // import mssql from 'mssql'
 
// // Configuration for the SQL Server connection
// const config = {
//   server: 'PPLUSDW',  // Replace with the actual server name or IP address of server 42
//   database: 'TrainingDB',
//   driver : 'msnodesqlv8',
//   options: {
//     trustedConnection: false,  // Use Windows authentication
//     trustServerCertificate: true,
//     // encrypt: false,
//   },
// };

 
// // Connect to SQL Server
// async function testDatabaseConnection() {
//   try {
//     // Try to connect to the database
//     const pool = await sql.connect(config);
//     const getall=await pool.request().query('SELECT * FROM PatientView')
//     console.log('data retrieved',getall.recordset)
//     // If the connection is successful, log a message
//     console.log('Connected to the database');

//     // Close the connection
//     await pool.close();
//   } catch (error) {
//     // If there is an error, log the error message
//     console.error('Error connecting to the database:', error.message);
//   }
// }

// // Call the function to test the database connection
// testDatabaseConnection()




//----------------------------------------------------------------------------
 const db = require('odbc');

const config = {
  server: "PPLUSDW",
  port: 1433,
  database: "TrainingDB",
  driver: 'ODBC Driver 17 for SQL Server',
  options: {
    trustedConnection: true,
    // trustServerCertificate: true, // Trust self-signed certificate
  },
};
module.exports=config;


async function testConnection() {
  try {
    const connectionString = `Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`;
    // await sql.connect(connectionString);
    const connection = await db.connect(connectionString);

    console.log('Connected to MSSQL Server');
    
    const queryResult = await connection.query("SELECT top 10 * FROM PatientView");
    // const queryResult = await connection.query("SELECT * FROM Patientinfo");
    // console.log('Query result:', queryResult);

    // queryResult.forEach(row => {
    //   console.log('Column Value:', row.columnName);
    // });
    // Proceed with further actions if needed

    console.log('Query result:', queryResult);

    // Don't forget to close the connection when done
    await connection.close();
    console.log('Connection closed');

    // Proceed with further actions if connection is successful
  } catch (err) {
    console.error('Error connecting to MSSQL Server:', err);
  }
}

testConnection()