import app from "./app";
import { S3 } from "@aws-sdk/client-s3";
import multer from "multer"
import multerS3 from "multer-s3"

const PORT = 3010;

const s3 = new S3({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const upload = multer({
	limits: {
		fileSize: 5 * 1024 * 1024 // 5MB
	},
	storage: multerS3({
		s3: s3,
		bucket: 'jakezegil-new-test-bucket',
		metadata: function (req, file, cb) {
			cb(null, {fieldName: file.fieldname});
		},
		key: function (req, file, cb) {
			cb(null, `${Date.now()}-${file.originalname}`);
		}
	})
})

app.get("/", async (req, res) => {
  const data = await s3.listBuckets();

  res.send({ buckets: data });
});

app.post("/upload", upload.single('grandma'), async (req, res) => {
  
	res.send({ message: "File uploaded" });
  });

  const images = {
	"123": "1722519292099-skyline_animated.jpeg"
  }
  
app.get("/image/:id", (req, res) => {
	const params = {
		Bucket: "jakezegil-new-test-bucket",
		Key: images[req.params.id]
	}

	const key = images[req.params.id]

	s3.getObject(params, async (err, data) => {
		if (err) {
			res.status(500).send(err)
			return;
		} 

		const fileBuffer = await data.Body?.transformToByteArray() 

		res.writeHead(200, {
			"Content-Type": "image/jpeg",
			"Content-Length": fileBuffer.length
		})
		res.end(fileBuffer, "binary")
	})

	// res.send({ message: "" })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
