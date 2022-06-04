import mongoose from "mongoose";

const memberSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
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
		default: "MEMBER",
	},
});

memberSchema.index({ username: "text" });
memberSchema.index({ username: 1, email: -1 });
export default mongoose.model("member", memberSchema);