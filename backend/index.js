const express=require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const authRoute = require('../backend/Router/authRouter.js')
// require('dotenv').config();
// console.log('REVIEW_ERROR_LOG:', process.env.REVIEW_ERROR_LOG);



app.use(bodyParser.urlencoded({ extended: true }));
app.use(express());
app.use(express.json());
app.use(bodyParser.json());
app.use(cors({credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']}));
app.use('/', authRoute);



// const port = 4000; //process.env.PORT || 3000;
// app.listen(port);
// console.log('Server is runnning at ' + port);

const port = 4001;
 // Replace with your actual local IP address

app.listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});

