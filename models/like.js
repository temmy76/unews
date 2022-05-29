import mongoose from "mongoose";

const likeSchema = mongoose.Schema({
	member_id: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: "member",
	},
	news_id: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: "news",
	},
});

export default mongoose.model("like", likeSchema);
