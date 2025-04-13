import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { Jimp } from "jimp";
import { parseOperations } from "./helper.js";
import { processImage } from "./imageOperator.js";

const app = express();
const port = 3000;

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const __dirname = path.resolve();

const upload = multer({ storage: storage });

// Create uploads directory if it doesn't exist
if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

// Route 1: Hello World
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Route 2: Fetch and send image
app.get("/image/:filename", async (req, res) => {
  const { filename } = req.params;
  const imagePath = path.join(__dirname, "uploads", filename);

  // Check if file exists
  if (fs.existsSync(imagePath)) {
    const image = await Jimp.read(imagePath);

    image.cover({ w: 150, h: 100 });

    const base64 = await image.getBuffer("image/png");
    res.writeHead(200, {
      "Content-Type": "image/png",
      "Content-Length": Buffer.byteLength(base64),
    });
    res.end(base64);
  } else {
    res.status(404).send("Image not found");
  }
});

// Route 3: Upload image
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }
  res.json({
    message: "File uploaded successfully",
    filename: req.file.filename,
  });
});

app.get("/op/image/:filename/{*operations}", async (req, res) => {
  const { filename, operations } = req.params;

  const parsedOperation = parseOperations(operations);

  const base64 = await processImage(filename, parsedOperation);

  if (!base64) {
    return res.status(404).send("Image not found");
  }

  res.writeHead(200, {
    "Content-Type": "image/png",
    "Content-Length": Buffer.byteLength(base64),
  });

  res.end(base64);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
