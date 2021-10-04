const express = require('express');
const app = express();

const port = 3001;
const mongoose = require('mongoose');
const morgan = require('morgan');
const dotenv = require('dotenv');
const helmet = require('helmet');
const multer = require('multer');
const userRoute = require('./routes/users')
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')

var cors = require('cors')

const path = require("path");



dotenv.config()




// var db=require('./config/connection')  

// mongoose.connect(
//     `process.env.MONGO_URL`,{ useNewUrlParser: true, useUnifiedTopology: true },
//     () => {
//       console.log("Connected to MongoDBddsdsdsdsd");
//       console.log("Connected sdsdsd");
//     }
//   );

mongoose.connect(
    'mongodb://localhost:27017/socialMedia',
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
      console.log("Connected to MongoDB");
    }
  );

// mongoose.connect(process.env.MONGO_URL,()=>{
//     console.log("Connected to MongoDBs");
//   }).
//   catch(error => handleError(error));

//   mongoose.connect('mongodb://localhost:27017/socialMedia',()=>{
//     console.log("Connected to MongoDB");
//   }).
//   catch(error => handleError(error));



app.use("/images", express.static(path.join(__dirname, "public/images")));

//middleware
app.use(cors())
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))





// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'public/images')
//   },
//   filename: function (req, file, cb) {
//     // cb(null, file.originalname)
//     console.log('hoooooooooiiiiiiiiiiiiiiiiiii');
//     console.log(req.body)
//     cb(null, file.originalname)
//   }
// })
// const upload = multer({ storage: storage })

// app.post("/api/upload",upload.single("file"),(req, res) => {
//   console.log('namooooooooooo');
//   console.log(req.body)

//   try{
//     console.log('hello am multer');
//     return res.status(200).json({message:"file upload success"});
//   }catch(err){
//     console.log(err);
//   }
// })

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    // console.log('hoooooooooiiiiiiiiiiiiiiiiiii');
    // console.log(file);
    // console.log(req.body)
    // cb(null, req.body.name);
    cb(null, req.body.name)
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  console.log(req.body)
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});




// app.get('/', (req, res) => {
//     res.send('hello world')
// })

// app.get('/users', (req, res) => {
//     res.send('hello users')
// })

app.listen(port,()=>{
    console.log(`the app is runn in port ${port}`);
});

app.use('/api/users',userRoute)
app.use('/api/auth',authRoute)
app.use('/api/posts',postRoute)