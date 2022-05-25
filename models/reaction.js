const mongoose = require("mongoose");

const reactionSchema = mongoose.Schema({
	member_id: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: "member",
	},
	news_id: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: "news",
	},
	like: { type: Boolean, default: false },
	dislike: { type: Boolean, default: false },
});

module.exports = mongoose.model("reaction", reactionSchema);
