import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
const app = express();
import memberRoute from "./routes/memberRoute";
import newsRoute from "./routes/newsRoute";
import News from "./models/newsModels";
import likeRoute from "./routes/likeRoute";
import path from "path";
const __dirname = path.resolve();

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
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
app.use("/js", express.static(__dirname + "public/js"));
app.use("/images", express.static(__dirname + "public/images"));
app.use("/fonts", express.static(__dirname + "public/fonts"));
app.set("view engine", "ejs");

app.use("/member", memberRoute);
app.use("/news", newsRoute);
app.use("/reaction", likeRoute);
app.use("/", (req, res) => {
	res.render("index");
});

app.listen(3000, () => {
	console.log(`Server is running in http://localhost:3000`);
});
