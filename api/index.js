const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const User = require("./models/user.js");
const Place = require("./models/place.js");
const CookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const imageDownloader = require("image-downloader");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Booking = require("./models/Booking.js");
const mime = require("mime-types");
const otpgen = require("otp-generator");
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "DjdiI14DIhjid25jadadn24ijipaoe44pq";
const bucket = "wave-bnb";
const Region = "ap-south-1";
const axios = require("axios");

const sendOTPKey = process.env.WEB_HOOK_KEY;

app.use(express.json());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(cookieParser());

async function uploadToS3(path, originalFilename, mimetype) {
     const client = new S3Client({
          region: "ap-south-1",
          credentials: {
               accessKeyId: process.env.S3_ACCESS_KEY,
               secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
          },
     });
     const parts = originalFilename.split(".");
     const ext = parts[parts.length - 1];
     const newFilename = Date.now() + "." + ext;
     const data = await client.send(
          new PutObjectCommand({
               Bucket: bucket,
               Body: fs.readFileSync(path),
               Key: newFilename,
               ContentType: mimetype,
               ACL: "public-read",
          })
     );
     return (
          "https://" +
          bucket +
          ".s3." +
          Region +
          ".amazonaws.com/" +
          newFilename
     );
}

function getUserDataFromReq(req) {
     return new Promise((resolve, reject) => {
          jwt.verify(
               req.cookies.token,
               jwtSecret,
               {},
               async (err, userData) => {
                    if (err) throw err;
                    resolve(userData);
               }
          );
     });
}

async function generateOTP() {
     return await otpgen.generate(6, {
          lowerCaseAlphabets: false,
          upperCaseAlphabets: false,
          specialChars: false,
     });
}
let otp = null;

app.use(
     cors({
          credentials: true,
          origin: "http://localhost:5173",
     })
);
console.log(process.env.MONGO_URL);

app.get("/api/test", (req, res) => {
     mongoose.connect(process.env.MONGO_URL);
     const { name, email, password } = req.body;
     res.json("test ok");
});
app.post("/api/register", async (req, res) => {
     mongoose.connect(process.env.MONGO_URL);
     const { name, email, password } = req.body;

     try {
          const userDoc = await User.create({
               name,
               email,
               password: bcrypt.hashSync(password, bcryptSalt),
          });
          res.json(userDoc);
     } catch (e) {
          res.status(422).json(e);
     }
});

app.post("/api/login", async (req, res) => {
     mongoose.connect(process.env.MONGO_URL);
     const { email, password } = req.body;
     const userDoc = await User.findOne({ email });
     if (userDoc) {
          const passOk = bcrypt.compareSync(password, userDoc.password);
          if (passOk) {
               jwt.sign(
                    {
                         email: userDoc.email,
                         id: userDoc._id,
                         name: userDoc.name,
                    },
                    jwtSecret,
                    {},
                    (err, token) => {
                         if (err) throw err;
                         res.cookie("token", token).json(userDoc);
                    }
               );
          } else {
               res.status(422).json("PassNotOk");
          }
     } else {
          res.status(404).json("User NotFound");
     }
});

app.get("/api/profile", (req, res) => {
     mongoose.connect(process.env.MONGO_URL);
     const { token } = req.cookies;
     if (token) {
          jwt.verify(token, jwtSecret, {}, async (err, userData) => {
               if (err) throw err;
               const { name, email, id } = await User.findById(userData.id);

               res.json({ name, email, id });
          });
     } else {
          res.json(null);
     }
});

app.post("/api/logout", (req, res) => {
     res.cookie("token", "").json(true);
});

app.post("/api/upload-by-link", async (req, res) => {
     const { link } = req.body;
     const newName = "photo" + Date.now() + ".jpg";
     await imageDownloader.image({
          url: link,
          dest: "/tmp/" + newName,
     });
     const url = await uploadToS3(
          "/tmp/" + newName,
          newName,
          mime.lookup("/tmp/" + newName)
     );
     res.json(url);
});
const photosMiddleware = multer({ dest: "/tmp" });
app.post(
     "/api/upload",
     photosMiddleware.array("photos", 100),
     async (req, res) => {
          const uploadedFiles = [];
          for (let i = 0; i < req.files.length; i++) {
               const { path, originalname, mimetype } = req.files[i];
               uploadedFiles.push(
                    await uploadToS3(path, originalname, mimetype)
               );
          }
          res.json(uploadedFiles);
     }
);

app.post("/api/places", (req, res) => {
     mongoose.connect(process.env.MONGO_URL);
     const { token } = req.cookies;
     const {
          title,
          address,
          addedPhotos,
          description,
          perks,
          extraInfo,
          checkIn,
          checkOut,
          maxGuests,
          price,
     } = req.body;
     jwt.verify(token, jwtSecret, {}, async (err, userData) => {
          if (err) throw err;
          const placeDoc = await Place.create({
               owner: userData.id,
               title,
               address,
               addedPhotos,
               description,
               perks,
               extraInfo,
               checkIn,
               checkOut,
               maxGuests,
               price,
          });
          res.json(placeDoc);
     });
});

app.get("/api/user-places", (req, res) => {
     mongoose.connect(process.env.MONGO_URL);
     const { token } = req.cookies;
     jwt.verify(token, jwtSecret, {}, async (err, userData) => {
          if (err) throw err;
          const { id } = userData;
          res.json(await Place.find({ owner: id }));
     });
});

app.get("/api/places/:id", async (req, res) => {
     mongoose.connect(process.env.MONGO_URL);
     const { id } = req.params;
     res.json(await Place.findById(id));
});
app.put("/api/places", async (req, res) => {
     mongoose.connect(process.env.MONGO_URL);
     const { token } = req.cookies;
     const {
          id,
          title,
          address,
          addedPhotos,
          description,
          perks,
          extraInfo,
          checkIn,
          checkOut,
          maxGuests,
          price,
     } = req.body;
     jwt.verify(token, jwtSecret, {}, async (err, userData) => {
          if (err) throw err;
          const placeDoc = await Place.findById(id);
          if (userData.id === placeDoc.owner.toString()) {
               placeDoc.set({
                    title,
                    address,
                    addedPhotos,
                    description,
                    perks,
                    extraInfo,
                    checkIn,
                    checkOut,
                    maxGuests,
                    price,
               });
               await placeDoc.save();
          }
     });
});

app.get("/api/places", async (req, res) => {
     mongoose.connect(process.env.MONGO_URL);
     res.json(await Place.find());
});

app.post("/api/bookings", async (req, res) => {
     mongoose.connect(process.env.MONGO_URL);
     const userData = await getUserDataFromReq(req);
     const { place, checkIn, checkOut, numberOfGuests, name, phone, price } =
          req.body;
     Booking.create({
          place,
          checkIn,
          checkOut,
          numberOfGuests,
          name,
          phone,
          price,
          user: userData.id,
     })
          .then((doc) => {
               res.json(doc);
          })
          .catch((err) => {
               throw err;
          });
});

app.get("/api/bookings", async (req, res) => {
     mongoose.connect(process.env.MONGO_URL);
     const userData = await getUserDataFromReq(req);
     res.json(await Booking.find({ user: userData.id }).populate("place"));
});

app.post("/api/login/auth", async (req, res) => {
     console.log(req.body);
     const type = req.body.type;
     const code = req.body.OTP;
     const email = req.body.mailId;
     console.log(type);
     console.log(code);
     if (type && type === "gen") {
          otp = await generateOTP();
          console.log("generating");
          console.log(process.env.WEB_HOOK_KEY);
          try {
               await axios.post(
                    `https://maker.ifttt.com/trigger/sendOTP/with/key/${process.env.WEB_HOOK_KEY}`,
                    {
                         value1: email,
                         value2: otp,
                    }
               );
               res.json("code generated");
          } catch (error) {
               console.log(error);
               res.status(500).json({ error: "Failed to send OTP" });
          }
     } else if (type && type === "verify") {
          console.log("verifying");
          if (parseInt(code) === parseInt(otp)) {
               otp = null;
               res.json("goodCode");
          } else {
               res.json("badCode");
          }
     } else {
          res.status(400).json({ error: "Invalid request" });
     }
});

app.listen(4000);
