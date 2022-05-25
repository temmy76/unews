const { default: mongoose } = require("mongoose");

const newsSchema = mongoose.Schema({
	title: { type: String, required: true },
	tags: { type: [String], required: true },
	categort: { type: [String], required: true },
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
		default: new Date(),
		immutable: true,
	},
	date_published: Date,
	views: Number,
	comment: {
		member_id: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "member",
		},
		username: String,
		date_comment: Date,
		desc_comment: String,
	},
	num_of_like: Number,
	num_of_dislike: Number,
});

module.exports = mongoose.model("news", newsSchema);
