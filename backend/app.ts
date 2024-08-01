import express from "express";
import cors from "cors";
const app = express();

app.use(
	cors({
		origin: ['origin(s)'],
		allowedHeaders: ['Authorization', 'Content-Type'],
	})
);

app.use(express.json());


export default app;
