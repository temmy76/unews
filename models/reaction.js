import mongoose from "mongoose";

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

export default mongoose.model("reaction", reactionSchema);
