const mongoose = require("mongoose");

mongoose
	.connect("mongodb://localhost/UNewsTest")
	.then(() => {
		console.log("Database Connected!");
	})
	.catch((err) => {
		console.log(`Cannot connect to database`, err);
		process.exit();
	});
