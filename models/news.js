import mongoose from "mongoose";

const newsSchema = mongoose.Schema({
	title: { type: String, required: true },
	tags: { type: [String], required: true },
	category: { type: [String], required: true },
	owner: {
		writer_id: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "member",
		},
		editor_id: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "member",
		},
		writer: String,
		editor: String,
	},
	description: { type: String, required: true },
	date_upload: {
		type: Date,
		default: Date.now(),
		immutable: true,
	},
	date_publish: Date,
	views: { type: Number, default: 0 },
	comment: {
		member_id: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "member",
		},
		username: String,
		date_comment: Date,
		desc_comment: String,
	},
	num_of_like: { type: Number, default: 0 },
});

export default mongoose.model("news", newsSchema);
