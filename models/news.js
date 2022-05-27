import mongoose from "mongoose";

const newsSchema = mongoose.Schema({
	title: { type: String, required: true },
	tags: { type: [String], required: true },
	category: { type: [String], required: true },
	owner: {
		writer: String,
		editor: String,
	},
	description: { type: String, required: true },
	date_upload: {
		type: Date,
		default: new Date(),
		immutable: true,
	},
	date_published: Date,
	views: Number,
	comment: {
		username: String,
		date_comment: Date,
		desc_comment: String,
	},
	num_of_like: Number,
	num_of_dislike: Number,
});

export default mongoose.model("news", newsSchema);
