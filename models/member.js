const mongoose = require("mongoose");

const memberSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
});

memberSchema.pre("validate", function (next) {
	const EmailRegex =
		/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
	this.email.match(EmailRegex) ? this.email : this.email.concat("@gmail.com");
});

module.exports = mongoose.model("member", memberSchema);
