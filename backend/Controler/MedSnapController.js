const db = require('odbc');
const config = require('../DBCONFIG/dbConfig');


const medsnapget= async (req,res)=> {
    try {
      //  const connectionString = `server=${config.server};Database=${config.database};Trusted_Connection=Yes;Driver={${config.driver}}`;
       const connectionString =`Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`
        // const pool = await sql.connect(config);
        const connection = await db.connect(connectionString);
  
        const {PatientIdentifier} = req.params
  
        // console.log('PatientIdentifier',PatientIdentifier)
  
        const getall = await connection.query(`SELECT * FROM vw_PatientSnapshotInfo
             where PatientIdentifier = '${PatientIdentifier}' `);
        // const jsonData = JSON(getall);
        // console.log(getall)
      // Close the connection
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


  const notesget= async (req,res)=> {
    try {
      //  const connectionString = `server=${config.server};Database=${config.database};Trusted_Connection=Yes;Driver={${config.driver}}`;
       const connectionString =`Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`
        // const pool = await sql.connect(config);
        const connection = await db.connect(connectionString);
  
        const {PatientIdentifier} = req.params
  
        // console.log('PatientIdentifier',PatientIdentifier)
  
        const getall = await connection.query(`SELECT * FROM vw_PatientSnapshotInfo
             where PatientIdentifier = '${PatientIdentifier}' `);
        // const jsonData = JSON(getall);
        // console.log(getall)
      // Close the connection
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




  const notesupdated = async (req, res) => {
    try {  
        const data = req.body
        let result = '';
        let result1 = '';
        let PatientIdentifier1= '';
        // const {name} = req.body
        // console.log(data)
        
        const connectionString = `Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`;
        const connection = await db.connect(connectionString);        
        //  const {updatedTableData} = data;
        const user = 'Ramya';
        // console.log(user);
        // const keys = Object.keys(data);
        // console.log(name);

       
            const {Notes,RecordModifiedBy,PatientIdentifier } = data;
            
        PatientIdentifier1 = PatientIdentifier;



        // Delete from the medication list
        const query = `UPDATE [dbo].[PatientView]
        SET 
            
           [Notes] = REPLACE(? , '''', '''')
           ,[RecordModifiedDate] = getdate()
           ,[RecordModifiedBy] = ?
              
      WHERE 
           [PatientIdentifier] = ? `;
        

        // Log parameter values for debugging
        // console.log('Parameters:', [
        //     Globalid, SSN, PatientName, Drug_name, sigs, QuantityDispensedDecimal, Pharmacy,
        //     DateDispensedSQL, Sb_LastModified, OnHold, user, PatientIdentifier
        // ]);

        // Execute the query directly using connection.query
         result = await connection.query(query, [Notes
          ,RecordModifiedBy
            ,PatientIdentifier
            
            
        ]);  
      
    
    
    const querypml = 'select * from [PatientView] where PatientIdentifier=? ' 
    result1 = await connection.query(querypml, [PatientIdentifier1]); 
    // console.log(result1.length)  
   
    if (result) {
        res.status(200).json({
            data: result1
            // message: 'Data inserted successfully.'
        });
    } else {
        throw new Error('Failed to insert data into database.');
    }
     
    await connection.close();
    
     // try end here
    
    }catch (error) {
        console.error('Error Updating data:', error);
        res.status(500).json({
            message: 'Failed to insert data into database.',
            error: error.message
        });
    }
};

  const medispackget= async (req,res)=> {
    try {
      //  const connectionString = `server=${config.server};Database=${config.database};Trusted_Connection=Yes;Driver={${config.driver}}`;
       const connectionString =`Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`
        // const pool = await sql.connect(config);
        const connection = await db.connect(connectionString);
  
        const {PatientIdentifier} = req.params


        // const sqlQuery = `
        //     SELECT 
        //         s.Quantity1, 
        //         s.Quantity2, 
        //         s.Quantity3, 
        //         s.Quantity4, 
        //         m.Drug_name, 
        //         m.IsPacked, 
        //         m.sigs, 
        //         m.PatientIdentifier, 
        //         m.ReviewedDate, 
        //         m.ReviewedBy
        //         ,m.PMID
        //         ,m.NdcNumber
        //         ,m.QuantityDispensed
        //         ,m.Prescriber
        //     FROM 
        //         PatientMedicationList m WITH (NOLOCK)
        //     LEFT JOIN 
        //         PatientMedSigQuantity s WITH (NOLOCK)
        //     ON 
        //         m.PatientIdentifier = s.PatientIdentifier and m.PMID = s.PMID
        //     WHERE 
        //         m.PatientIdentifier = ?;c
        // `;

        const sqlQuery = `EXEC [dbo].[Sp_GetPatientMedSigQuantityDetails] ?`

        const getall = await connection.query(sqlQuery,[PatientIdentifier]);
  
        // console.log('PatientIdentifier',PatientIdentifier)
  
        // const getall = await connection.query(`SELECT Drug_name, IsPacked, sigs, IsRxqDeleted, ReviewedBy, ReviewedDate FROM PatientMedicationList
        //      where PatientIdentifier = '${PatientIdentifier}'  `);
        // const jsonData = JSON(getall);
        // console.log(getall)
      // Close the connection
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


  const viewgetdata= async (req,res)=> {
    try {
       const connectionString =`Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`
        const connection = await db.connect(connectionString);

        const {PatientIdentifier} = req.params

  
  
        const getall = await connection.query(` SELECT * FROM PatientView where PatientIdentifier = '${PatientIdentifier}'`);
        
  
      // Close the connection
      await connection.close();
  
  
      // Send JSON data as response
      res.status(200).json({
        // status: 'Success',
        message: 'Data fetched successfully.',
        data: getall,
      });
  
    }
    catch (error) {
        console.log('Db not connected :',error);
        
    }
  }



  const SP_review= async (req,res)=> {
    try {
       const connectionString =`Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`
        const connection = await db.connect(connectionString);
        const { PatientIdentifier } = req.params;
        // const PatientIdentifier = identify.PatientIdentifier;
        // console.log('identifier',PatientIdentifier);
        // const sp = `exec  Usp_LibertyMedicationList_CompPack_Get  '?'`
  
        const result = await connection. 
                      query
                      (`exec  Sp_GetPatientReviewDetails  '${PatientIdentifier}' 
                      `);
    // console.log('result',result)
  
    
      await connection.close();
  
      // Send JSON data as response ${identify.PatientIdentifier}
      
      res.status(200).json({
        message: 'Data fetched successfully.',
        data : result
      });
       
  
    } catch (error) {
      console.error('Error executing SQL query:', error);
      res.status(500).json({
        message: 'Failed to fetch data from database.',
        error: error.message
      });
    }
  };



  const latestpinget= async (req,res)=> {
    try {
      //  const connectionString = `server=${config.server};Database=${config.database};Trusted_Connection=Yes;Driver={${config.driver}}`;
       const connectionString =`Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`
        // const pool = await sql.connect(config);
        const connection = await db.connect(connectionString);
  
        const {PatientIdentifier} = req.params
  
        // console.log('PatientIdentifier',PatientIdentifier)
  
        const getall = await connection.query(`select top 1 Notes 
        from PatientView_NotesHistory
        where IsPinned=1
        and PatientIdentifier = '${PatientIdentifier}'
        order by RecordModifiedDate desc
              `);
        // const jsonData = JSON(getall);
        // console.log(getall)
      // Close the connection
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
                     medsnapget,
                     medispackget,
                     viewgetdata,
                     SP_review,
                     latestpinget,
                     notesget,
                     notesupdated,
  }