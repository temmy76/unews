import News from "../models/newsModels";
import Member from "../models/memberModels";
import Like from "../models/likeModels";

export default {
	getAll: async (req, res) => {
		const like = await Like.find();
		res.json(like);
	},
	LikeNews: async (req, res) => {
		// buat like dan unlike
		const member = await Member.findById(req.body.member_id);
		const news = await News.findById(req.body.news_id);

		if (news === null)
			return res.json({
				message: `There is no news with id: ${req.body.news_id}`,
			});

		if (!member || member.roles === "RESTRICT")
			return res.json({ message: "Member doesn't exist!" });

		let like = await Like.findOneAndDelete({
			news_id: req.body.news_id,
			member_id: req.body.member_id,
		});

		if (like == null) {
			let like = await Like.create({
				news_id: req.body.news_id,
				member_id: req.body.member_id,
			});

			return res.json(like);
		}

		res.json({ message: "like dihapus" });
	},
	getPostLike: async (req, res) => {
		const like = await Like.find({ news_id: req.params.id });

		res.json(like);
	},
};
