const config = require("../DBCONFIG/dbConfig");
const db = require("odbc");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const dbgetdata = async (req, res) => {
  try {
    const connectionString = `Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`;
    const connection = await db.connect(connectionString);

    const getall = await connection.query(
      "SELECT * FROM PatientView with(nolock) order by DisplayName asc"
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

const cldrgetdata = async (req, res) => {
  try {
    const connectionString = `Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`;
    const connection = await db.connect(connectionString);

    const getall =
      await connection.query(`SELECT * FROM vw_calenderinfo with(nolock) 
        order by DisplayName asc`);

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

const createdata = async (req, res) => {
  try {
    const connectionString = `Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`;
    const patientData = req.body;
    console.log(patientData);

    const connection = await db.connect(connectionString);
    const result = await connection.query(`
      UPDATE PatientView
      SET 
          
          ActiveStatus = '${patientData.ActiveStatus}',
          HomePharmarcy = ${
            patientData.HomePharmarcy
              ? `'${patientData.HomePharmarcy}'`
              : "NULL"
          },
          PackPharmarcy = ${
            patientData.PackPharmarcy
              ? `'${patientData.PackPharmarcy}'`
              : "NULL"
          },
          RecordModifiedBy = '${patientData.RecordModifiedBy}',
          RecordModifiedDate = GetDate()
      WHERE PatientIdentifier = '${patientData.PatientIdentifier}'

    `);
    //  console.log(result)
    //  console.log(patientData.LastPackDate)

    await connection.close();

    res.status(200).json({ message: "Data updated successfully" });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(400).json({ error: "Failed to update data" });
  }
};

const createdatadate = async (req, res) => {
  try {
    const connectionString = `Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`;
    const patientData = req.body;

    const connection = await db.connect(connectionString);
    const result = await connection.query(`
      UPDATE PatientView
      SET 
          LastPackDate = ${
            patientData.LastPackDate ? `'${patientData.LastPackDate}'` : "NULL"
          },
          NextPackDate = ${
            patientData.NextPackDate ? `'${patientData.NextPackDate}'` : "NULL"
          }
      WHERE  PatientIdentifier = '${patientData.PatientIdentifier}'
        
    `);
    //  console.log(result)

    await connection.close();

    res.status(200).json({ message: "Data updated successfully" });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(400).json({ error: "Failed to update data" });
  }
};

// const Login = async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const connectionString =`Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`
//     // Establish connection
//     const connection = await db.connect(connectionString);

//     // Prepare SQL statement
//     const query = `SELECT Names, password, username FROM users WHERE username = ?`;

//     // Execute query
//     const result = await connection.query(query, [username]);

//     if (result.length > 0) {
//       const user = result[0];
//       // console.log(user);

//       // Since passwords are stored in plain text, we'll do a direct comparison
//       if (password === user.password && username === user.username) {
//         const token = jwt.sign({ username: user.username, name: user.Names }, config.JWT_SECRET, { expiresIn: '1h' });
//         res.status(200).json({ name: user.Names, token: token });
//       } else {
//         res.status(403).json({ message: 'Invalid username or password' });
//       }
//     } else {
//       res.status(401).json({ message: 'Invalid username or password' });
//     }

//     // Close the connection
//     await connection.close();
//   } catch (error) {
//     console.error('Error executing query:', error);
//     // res.status(500).json({ message: 'Internal server error', sqlMessage: error.message });

//     if (error.odbcErrors && error.odbcErrors.length > 0) {
//       // Check for specific error codes
//       const dbError = error.odbcErrors.find(err => err.code === 4060) || error.odbcErrors[0];

//       if (dbError.code === 4060) {
//           // Error Code 4060: Cannot open database
//           res.status(500).json({
//               message: 'Database server is not accessible. Check if the database server is up and accessible',
//               code: dbError.code,
//           });
//       } else if (dbError.code === 53 || dbError.code === 10061 ||dbError.code === 18456 ) {
//           // Error Code 53: Server/Database not found
//           res.status(503).json({
//               message: 'Database server is not accessible. Check if the database server is up and accessible',
//               code: dbError.code,
//           });
//       }
//     }
//   }
// };

const Login = async (req, res) => {
  const { pLoginName, pPassword } = req.body; // username and plain text password

  try {
    // Hash the password using the same algorithm as in your database (SHA2_512)

    const connectionString = `Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`;

    // Establish ODBC connection
    const connection = await db.connect(connectionString);

    // SQL query to call stored procedure and retrieve the name if login is valid
    const query = `
      DECLARE @responseMessage NVARCHAR(250);
      EXEC dbo.uspLoginCheck
        @pLoginName = ?, 
        @pPassword = ?, 
        @responseMessage = @responseMessage OUTPUT;
      SELECT @responseMessage as ResponseMessage;
    `;

    // Execute the query and pass the login credentials
    const result = await connection.query(query, [pLoginName, pPassword]);

    // Get response from the stored procedure
    const responseMessage = result[0].ResponseMessage;

    if (responseMessage === "Valid Login") {
      // If login is valid, retrieve the user's name
      const userQuery = `
        SELECT Name, Role, RoleDesc FROM dbo.UserDetails WHERE EmailID = ?;
      `;
      const userResult = await connection.query(userQuery, [pLoginName]);
      console.log(userResult, "result");
      //   if (userResult.length > 0) {
      //     const userName = userResult[0].Names;
      //     res.status(200).json({ message: 'Login successful', name: userName });
      //   }
      // } else {
      //   // Return invalid login message
      //   return res.status(401).json({ message: responseMessage });
      // }

      if (userResult.length > 0) {
        const user = userResult[0];
        console.log(user.RoleDesc);
        const token = jwt.sign(
          {
            username: user.EmailID,
            name: user.Name,
            Role: user.Role,
            RoleDesc: user.RoleDesc,
          },
          config.JWT_SECRET
        );
        res
          .status(200)
          .json({
            name: user.Name,
            token: token,
            Role: user.Role,
            RoleDesc: user.RoleDesc,
          });
      } else {
        res.status(401).json({ message: "User not found or inactive" });
      }
    } else if (responseMessage === "Incorrect password") {
      res.status(401).json({ message: "Incorrect password" });
    } else {
      res.status(401).json({ message: "Invalid username or user inactive" });
    }

    await connection.close();
  } catch (error) {
    console.error("Error during login:", error);
    // return res.status(500).json({ message: 'Server error' });

    if (error.odbcErrors && error.odbcErrors.length > 0) {
      // Check for specific error codes
      const dbError =
        error.odbcErrors.find((err) => err.code === 4060) ||
        error.odbcErrors[0];

      if (dbError.code === 4060 || error.odbcErrors[0]) {
        // Error Code 4060: Cannot open database
        res.status(500).json({
          message:
            "Database server is not accessible. Check if the database server is up and accessible",
          code: dbError.code,
        });
      } else if (
        dbError.code === 53 ||
        dbError.code === 10061 ||
        dbError.code === 18456
      ) {
        // Error Code 53: Server/Database not found
        res.status(503).json({
          message:
            "Database server is not accessible. Check if the database server is up and accessible",
          code: dbError.code,
        });
      }
    }
  }
};

const ChangePassword = async (req, res) => {
  const { Username, OldPassword, NewPassword } = req.body; // Username will come from frontend

  try {
    const connectionString = `Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`;
    const connection = await db.connect(connectionString);

    // Get user by username
    const query = `DECLARE @responseMessage NVARCHAR(250);
 
               EXEC [dbo].[uspChangePassword]
               @Username = ?,
               @OldPassword = ?,
               @NewPassword = ?,
               @responseMessage = @responseMessage OUTPUT;
               SELECT @responseMessage as ResponseMessage;
               `;
    const result = await connection.query(query, [
      Username,
      OldPassword,
      NewPassword,
    ]);

    const responseMessage = result[0].ResponseMessage;
    console.log(responseMessage, "result");

    console.log(NewPassword, "NewPassword");

    if (responseMessage === "Success") {
      res.status(200).json(responseMessage);
    } else if (responseMessage === "Incorrect password") {
      res.status(400).json({ message: "Please Enter Correct Password " });
    } else if (responseMessage === "Invalid login") {
      res.status(401).json({ message: "Please Enter Valid Username" });
    }

    // }

    await connection.close();
  } catch (error) {
    console.error("Error executing query:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const Notegetdata = async (req, res) => {
  try {
    //  const connectionString = `server=${config.server};Database=${config.database};Trusted_Connection=Yes;Driver={${config.driver}}`;
    const connectionString = `Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`;
    // const pool = await sql.connect(config);
    const connection = await db.connect(connectionString);

    const { PatientIdentifier } = req.params;

    const getall =
      await connection.query(`select PVNHID,GlobalId,SSN,PatientName,DateOfBirth,Notes,RecordModifiedBy,RecordModifiedDate, IsPinned, RecordCreatedDate
      from PatientView_NotesHistory
      where PatientIdentifier='${PatientIdentifier}'
      order by IsPinned desc,case when IsPinned=1 then RecordModifiedDate 
      else  RecordCreatedDate end desc`);

    // console.log(PatientIdentifier)
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

const notepinupdate = async (req, res) => {
  try {
    const data = req.body;
    let result = "";
    let result1 = "";
    let PatientIdentifier1 = "";
    const { name } = req.body;
    // console.log(data)

    const connectionString = `Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`;
    const connection = await db.connect(connectionString);
    //  const {updatedTableData} = data;
    const user = name;
    // console.log(user);
    // const keys = Object.keys(data);
    // console.log(name);

    const { IsPinned, PatientIdentifier, PVNHID } = data;

    PatientIdentifier1 = PatientIdentifier;

    // Delete from the medication list
    const query = `UPDATE [dbo].[PatientView_NotesHistory]
      SET 
          [IsPinned] = ?
         
         ,[RecordModifiedDate] = getdate()
         ,[RecordModifiedBy] = ?
              
    WHERE 
         [PatientIdentifier] = ? and 
         [PVNHID]=? `;

    // Log parameter values for debugging
    // console.log('Parameters:', [
    //     Globalid, SSN, PatientName, Drug_name, sigs, QuantityDispensedDecimal, Pharmacy,
    //     DateDispensedSQL, Sb_LastModified, OnHold, user, PatientIdentifier
    // ]);

    // Execute the query directly using connection.query
    result = await connection.query(query, [
      IsPinned,
      user,
      PatientIdentifier,
      PVNHID,
    ]);

    const querypml =
      "select * from [PatientView_NotesHistory] where PatientIdentifier=? ";
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

module.exports = {
  createdata,
  Login,
  dbgetdata,
  createdatadate,
  Notegetdata,
  notepinupdate,
  ChangePassword,
  cldrgetdata,
};
