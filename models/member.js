import mongoose from "mongoose";

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
	roles: {
		type: String,
		enum: ["ADMIN", "MEMBER", "RESTRICT"],
		required: true,
	},
});

export default mongoose.model("member", memberSchema);
