import app from "./app";
import { S3 } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";

const PORT = 3010;

const s3 = new S3({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = "jakezegil-new-test-bucket";

const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  storage: multerS3({
    s3: s3,
    bucket: BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});

app.get("/", async (req, res) => {
  const data = await s3.listBuckets();

  res.send({ buckets: data });
});

app.post("/upload", upload.single("file"), async (req, res) => {
  // req.file is the file that was uploaded
  console.log(req.file);

  // store the file in the database
  const params = {
    Bucket: BUCKET_NAME,
    Key: req.file?.filename,
  };

  res.send({ message: "File uploaded" });
});

const images = {
  "123": "1722519292099-skyline_animated.jpeg",
  "456": "1730208738686-Ga2UyndWkAAn5h2.jpeg",
};

app.get("/image/:id", (req, res) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: images[req.params.id],
  };

  const key = images[req.params.id];

  s3.getObject(params, async (err, data) => {
    if (err) {
      res.status(500).send(err);
      return;
    }

    const fileBuffer = await data.Body?.transformToByteArray();

    res.writeHead(200, {
      "Content-Type": "image/jpeg",
      "Content-Length": fileBuffer.length,
    });
    res.end(fileBuffer, "binary");
  });

  // res.send({ message: "" })
});

app.get("/form", (req, res) => {
  res.send(`<form action="/upload" method="post" enctype="multipart/form-data">
  <input type="file" name="file" accept="image/*">
  <button type="submit">Upload</button>
  </form>`);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
