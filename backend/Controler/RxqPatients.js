const db = require('odbc');
const config = require('../DBCONFIG/dbConfig');


const rxqPatients = async (req,res)=> {
    try {
       const connectionString =`Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`
        const connection = await db.connect(connectionString);
  
        const {
            GlobalId,
            SocialSecurityNumber,
            DateOfBirth,
            FirstName,
            LastName,
            Source_Indicator
          } = req.body;
  
        // console.log('PatientIdentifier',PatientIdentifier)
  
               const query = `
               EXEC Sp_FetchPatientsInfo 
               @GlobalId = ?,
               @SocialSecurityNumber = ?,
               @DateOfBirth = ?,
               @FirstName = ?,
               @LastName = ?,
               @Source_Indicator = ?
         `;

             const result = await connection.query(query, [GlobalId, SocialSecurityNumber, DateOfBirth, FirstName, LastName, Source_Indicator]);
       
      await connection.close();
  
      // Send JSON data as response
      res.status(200).json({
        message: 'Data fetched successfully.',
        data : getall
      });
  
        // console.log('data retireved',getall.recordset)
        // return getall;
    }
    catch (error) {
        console.log('Db not connected :',error);
    }
  }

  module.exports = {
            rxqPatients
  }