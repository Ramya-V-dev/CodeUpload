// import odbc from "odbc";

const config = {
   server: "DESKTOP-JD4RCI7\\SQLEXPRESS",
    port: 1433,
    database: "MediTrackerDB_Test",
    driver: "ODBC Driver 17 for SQL Server",
    options: {
      trustedConnection:true,
      // trustServerCertificate: true,
      // encrypt: true,
  
    },
    JWT_SECRET: 'PP_Key_med'
  };
  
  module.exports=config;