const config = require("../DBCONFIG/dbConfig");
const db = require("odbc");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const getadduser = async (req, res) => {
  try {
    const connectionString = `Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`;
    const connection = await db.connect(connectionString);

    //     const query = `
    //     SELECT ID, Name, EmailID, RoleDesc,
    //     CASE WHEN Isactive = 1 THEN 'Active' ELSE 'Inactive' END AS Status,
    //     ModifiedBy, CAST(ModifiedDate AS DATE) AS ModifiedDate
    //     FROM UserDetails
    //     WHERE Is_SSUser = 0
    // `;

    const query = `
       select ID, Name, EmailID ,RoleDesc,
Case when Isactive=1 then 'Active'  else 'Inactive' end Status , 
 RecordModifiedBy,cast(RecordModifiedDate as date) as RecordModifiedDate
from UserDetails
where Is_SSUser=0 order by Role asc ,Name asc
    `;

    const result = await connection.query(query);
    // console.log(result,'got')
    // Close the connection
    await connection.close();

    // Send JSON data as response
    res.status(200).json({
      // status: 'Success',
      message: "Data fetched successfully.",
      data: result,
    });
  } catch (error) {
    console.log("Db not connected :", error);
    res.status(500).json({
      message: "An error occurred while fetching data.",
      error: error.message,
    });
  }
};

const adduserinfo = async (req, res) => {
  let addcount = 0;
  let addfalcount = 0;
  try {
    const connectionString = `Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`;
    const connection = await db.connect(connectionString);

    const { pName, pLogin, Role, ModifiedUser } = req.body;
    const defaultPassword = "DefaultPwd@123";
    const ActiveStatus = "active";

    const existingUser = await connection.query(
      `SELECT COUNT(*) AS count FROM UserDetails WHERE EmailID = ?`,
      [pLogin]
    );

    if (existingUser[0].count > 0) {
      await connection.close();
      return res.status(400).json({ message: "Email already exists." });
    }

    const query = `
            DECLARE @responseMessage NVARCHAR(250);
           EXEC dbo.uspAddUser
           @pName = ?, 
           @pLogin = ?, 
           @pPassword = ?, 
           @Role = ?, 
           @ModifiedUser = ?, 
           @ActiveStatus = ?, 
           @responseMessage = @responseMessage OUTPUT;
            SELECT @responseMessage as ResponseMessage;
             `;

    const result = await connection.query(query, [
      pName,
      pLogin,
      defaultPassword,
      Role,
      ModifiedUser,
      ActiveStatus,
    ]);

    if (result.count && result.count > 0) {
      addcount++;
    } else {
      addfalcount++;
    }

    await connection.close();

    console.log(result, "stored");

    // Send JSON data as response
    res.status(200).json({
      message: "Data fetched successfully.",
      data: result,
      addcount,
    });
  } catch (error) {
    console.log("Db not connected :", error);
  }
};

const Modifyuserinfo = async (req, res) => {
  try {
    const connectionString = `Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`;
    const connection = await db.connect(connectionString);

    const { pName, pLogin, Role, ActiveStatus, ModifiedUser } = req.body;

    const query = `
            DECLARE @responseMessage NVARCHAR(250);
           EXEC dbo.uspAddUser
           @pName = ?, 
           @pLogin = ?, 
           @pPassword = Null, 
           @Role = ?, 
           @ModifiedUser = ?, 
           @ActiveStatus = ?, 
           @responseMessage = @responseMessage OUTPUT;
            SELECT @responseMessage as ResponseMessage;
             `;

    const result = await connection.query(query, [
      pName,
      pLogin,
      Role,
      ModifiedUser,
      ActiveStatus,
    ]);

    await connection.close();

    console.log(result, "stored");

    // Send JSON data as response
    res.status(200).json({
      message: "Data fetched successfully.",
      data: result,
    });
  } catch (error) {
    console.log("Db not connected :", error);
  }
};

const adduserdelete = async (req, res) => {
  const { ID, User } = req.body;
  let delcount = 0;

  try {
    const connectionString = `Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`;
    const connection = await db.connect(connectionString);
    // const { PMID,name } = req.params;
    // console.log(PMID,'deleted date')
    //       const query = `EXEC [dbo].[SP_UserDetails_Delete] ?, ?`;
    // await connection.query(query, [ID, User]);
    const result = await connection.query(
      `EXEC [dbo].[SP_UserDetails_Delete] '${ID}', '${User}'`
    );
    console.log(result.count, "reult");
    if (result.count && result.count > 0) {
      delcount++;
    } else {
      console.log("Failed to delete");
    }
    res
      .status(200)
      .send({ message: "Record deleted successfully", data: result, delcount });

    await connection.close();
  } catch (error) {
    console.error("Error deleting data:", error);
    res
      .status(500)
      .send({ message: "Failed to delete data", error: error.message });
  }
};

const resetpwd = async (req, res) => {
  let resetcount = 0;
  let failcount = 0;
  try {
    const connectionString = `Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`;
    const connection = await db.connect(connectionString);

    const { pName, pLogin, Role, ModifiedUser, ActiveStatus } = req.body;
    const defaultPassword = "DefaultPwd@123";
    // const ActiveStatus = 'active';

    const query = `
          DECLARE @responseMessage NVARCHAR(250);
         EXEC dbo.uspAddUser
         @pName = ?, 
         @pLogin = ?, 
         @pPassword = ?, 
         @Role = ?, 
         @ModifiedUser = ?, 
         @ActiveStatus = ?, 
         @responseMessage = @responseMessage OUTPUT;
          SELECT @responseMessage as ResponseMessage;
           `;

    const result = await connection.query(query, [
      pName,
      pLogin,
      defaultPassword,
      Role,
      ModifiedUser,
      ActiveStatus,
    ]);
    const responseMessage = result[0]?.ResponseMessage || "";

    // Check if the response message contains 'Success'
    if (responseMessage.includes("Success")) {
      resetcount++;
    } else {
      failcount++;
    }

    await connection.close();

    console.log(resetcount, "stored");

    // Send JSON data as response
    res.status(200).json({
      message: "Data fetched successfully.",
      data: result,
      resetcount,
      defaultPassword,
    });
  } catch (error) {
    console.log("Db not connected :", error);
  }
};

const SP_patientinfo = async (req, res) => {
  try {
    const connectionString = `Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`;
    const connection = await db.connect(connectionString);
    const {
      GlobalId,
      SocialSecurityNumber,
      DateOfBirth,
      FirstName,
      LastName,
      Source_Indicator,
    } = req.body;

    // Use parameterized query with ?
    const query = `EXEC Sp_FetchPatientsInfo 
    @GlobalId = ?,
    @SocialSecurityNumber = ?,
    @DateOfBirth = ?,
    @FirstName = ?,
    @LastName = ?,
    @Source_Indicator = ?`;

    // console.log("Executing Query:", query);
    // console.log("With Parameters:", params);

    const result = await connection.query(query, [
      GlobalId,
      SocialSecurityNumber,
      DateOfBirth,
      FirstName,
      LastName,
      Source_Indicator,
    ]);
    console.log("Result:", result.recordset);
    console.log(result);
    if (!result || !result.recordset || result.recordset.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

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

module.exports = {
  getadduser,
  adduserinfo,
  Modifyuserinfo,
  adduserdelete,
  resetpwd,
  SP_patientinfo,
};
