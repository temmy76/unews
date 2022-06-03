import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
const app = express();
import memberRoute from "./routes/memberRoute";
import newsRoute from "./routes/newsRoute";
import likeRoute from "./routes/likeRoute";
mongoose
	.connect(`mongodb://localhost/${process.env.DB_NAME}`)
	.then(() => {
		console.log("Database Connected!");
	})
	.catch((err) => {
		console.log(`Cannot connect to database`, err);
		process.exit();
	});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// app.use("/post");
app.use("/member", memberRoute);
app.use("/news", newsRoute);
app.use("/like", likeRoute);
app.get("/", (req, res) => {
	res.render("index");
});

app.listen(3000, () => {
	console.log(`Server is running in http://localhost:3000`);
});
