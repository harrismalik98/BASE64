const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
const cors = require('cors');


const app = express();
app.set("view engine", "ejs");

app.use(cors());

mongoose.set('strictQuery', true);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); //Taking it to public folder.so we can use our CSS.


mongoose.connect("mongodb://127.0.0.1:27017/base64");

const clientSchema = new mongoose.Schema({
    name: String,
    image: String,
    filetype: String,
});

const Client = mongoose.model('Client', clientSchema);


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'public/images/');
    },
    filename: function(req, file, cb) {
      cb(null, file.originalname);
    }
  });
  
  const upload = multer({ storage: storage });

app.post("/upload", upload.single("image") , function (req, res) {
    const name = req.body.name;

    const buffer = fs.readFileSync(req.file.path);
    const image = buffer.toString("base64");

    const filetype = req.file.mimetype;

    const client = new Client({
        name: name,
        image:image,
        filetype:filetype,
    });

    client.save(function (err) {
        if (err) {
           res.status(400).send("Data not save successfully");
        }
        else {
            res.status(201).send("Data save successfully");
        }
    });
});


//========================= Show ALL Users ===================//
app.get('/show', (req, res) => {
    Client.find((error, data) => {
        if (error) {
            res.status(400).send(error)
        } else {
            res.status(200).send(data);
        }
    });
});




app.listen("5000", function (req, res) {
    console.log("Server running at port 5000");
});