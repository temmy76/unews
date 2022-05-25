const express = require("express");
const mongoose = require("mongoose");
const app = express();

mongoose
	.connect("mongodb://localhost/UNewsTest")
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

app.get("/", (req, res) => {
	res.render("index");
});

app.listen(3000, () => {
	console.log(`Server is running in http://localhost:3000`);
});
