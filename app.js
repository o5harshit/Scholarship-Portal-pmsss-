const express = require("express");
const app = express();
const dotenv = require("dotenv");
const path = require("path");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const student = require("./Models/Student");
const nodemailer = require("nodemailer");

dotenv.config();

app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/images")));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");

const port = process.env.PORT || 3001;

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/ScholarShip");
}

main()
  .then(() => {
    console.log("Connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

//routes
app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});

app.get("/home", (req, res) => {
  res.render("./home/home.ejs");
});

app.get("/home/Slogin", (req, res) => {
  res.render("./loginPages/login.ejs");
});

function generateOTP(length = 5) {
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10); // Generate a random digit from 0 to 9
  }
  return otp;
}

app.post("/Slogin/new", async (req, res) => {
  let { Email, Password, Aadharcard } = req.body;
  console.log(req.body);
  const newStudent = new student(req.body.student);
  await newStudent.save();
  console.log(req.body.student.Email);
  const otp = generateOTP();
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "srivastavaharshit400@gmail.com", // Sender address
      pass: "lqwx fwht nsql vacc", // App password for gmail
    },
  });
  const mailOptions = {
    from: {
      name: "ScholarShip Portal",
      address: process.env.USER,
    },
    to: [req.body.student.Email],
    subject: "Scholarship-from Check Authentication",
    text: `Your OTP for the Verfication is ${otp}..Dont Share with Anyone`,
  };
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log("email.sent: " + info.response);
    }
  });
  res.render("./loginPages/emailhandler.ejs");
});
