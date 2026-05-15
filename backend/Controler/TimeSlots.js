const db = require('odbc');
const config = require('../DBCONFIG/dbConfig');


const timequantityslot = async (req,res)=> {
    try {
       const connectionString =`Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`
        const connection = await db.connect(connectionString);
  
        const {PatientIdentifier} = req.params
  
        // console.log('PatientIdentifier',PatientIdentifier)
  
        const getall = await connection.query(`SELECT * FROM PatientMedTimeSlots
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

  const  timeheadslot = async (req,res)=> {
    try {
       const connectionString =`Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`
        const connection = await db.connect(connectionString);
  
        const {PatientIdentifier} = req.params


        const query = `
        select 
        m.PatientIdentifier,
        t.TimeSlot1,
        t.TimeSlot2,
       t.TimeSlot3,
        t.TimeSlot4 
        from PatientMedTimeSlots t
        right join PatientMedicationList m 
        on m.PatientIdentifier = t.PatientIdentifier 
        where m.IsPacked = 'Yes' and m.PatientIdentifier = ?

        `;
         const getall = await connection.query(query,[PatientIdentifier]);
  
        // console.log('PatientIdentifier',PatientIdentifier)
  
        // const getall = await connection.query(`SELECT * FROM PatientMedSigQuantity
        //      where PatientIdentifier = '${PatientIdentifier}' `);
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


  const sp_headerslot= async (req,res)=> {
    try {
       const connectionString =`Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`
        const connection = await db.connect(connectionString);
        

        const { PatientIdentifier, TimeSlot1, TimeSlot2, TimeSlot3, TimeSlot4, user } = req.body;
  
        const query = `
            EXEC dbo.Sp_PatientMedTimeSlots_Insert
             @PatientIdentifier = ?,
             @TimeSlot1 = ?,
             @TimeSlot2 = ?,
             @TimeSlot3 = ?,
             @TimeSlot4 = ?,
             @user = ?
             `;

    const result = await connection.query(query, [PatientIdentifier, TimeSlot1, TimeSlot2, TimeSlot3, TimeSlot4, user]);
    
      await connection.close();

      console.log(result,'timeslot')
  
      // Send JSON data as response ${identify.PatientIdentifier}
      
      res.status(200).json({
        message: 'Data UPDATED successfully.',
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


  const sp_quantityslot= async (req,res)=> {
    try {
       const connectionString =`Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`
        const connection = await db.connect(connectionString);

        const data = req.body
       
         console.log(data,'data')
        const { PMID, PatientIdentifier, Quantity1, Quantity2, Quantity3, Quantity4, user, Drug_name } = data;
  
        const query = `
            DECLARE @Medications PatientMedSigQuantityUpdateType;
           INSERT INTO @Medications (PMID, PatientIdentifier, Drug_name, Quantity1, Quantity2, Quantity3, Quantity4)
            VALUES (?, ?, ?, ?, ?, ?, ?);
        
             EXEC dbo.Sp_PatientMedSigQuantityUpdateBatch @Medications = @Medications, @user = ?;
             `;

    const result = await connection.query(query, [PMID, 
                                      PatientIdentifier,
                                      Drug_name,
                                      // Quantity1 !== undefined ? parseFloat(Quantity1) : null,
                                      // Quantity2 !== undefined ? parseFloat(Quantity2) : null,
                                      // Quantity3 !== undefined ? parseFloat(Quantity3) : null,
                                      // Quantity4 !== undefined ? parseFloat(Quantity4) : null 
                                      Quantity1, 
                                      Quantity2, 
                                      Quantity3, 
                                      Quantity4,
                                      user
                                    ]);
    
      await connection.close();
  
      // Send JSON data as response ${identify.PatientIdentifier}

      // console.log(result,'sprun')
      
      res.status(200).json({
        message: 'Data UPDATED successfully.',
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


  module.exports = {
                   timeheadslot,
                   timequantityslot,
                   sp_headerslot,
                   sp_quantityslot,
  }