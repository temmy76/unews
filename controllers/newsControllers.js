import News from "../models/newsModels";
import Member from "../models/memberModels";
import Like from "../models/likeModels";

export default {
	showPublished: async (req, res) => {
		// index awal dengan berita yang sudah dipublish oleh editor
		const news = await News.find();
		let publishedNews = [];
		for (let i = 0; i < news.length; i++) {
			// console.log(news[i]);
			if (news[i].owner.editor) publishedNews.push(news[i]);
		}
		res.json(publishedNews);
	},
	showUnpublished: async (req, res) => {
		// menampilkan post berita yang belum dipublish oleh editor
		const news = await News.find();
		let unpublishedNews = [];
		for (let i = 0; i < news.length; i++) {
			// console.log(news[i]);
			if (!news[i].owner.editor) unpublishedNews.push(news[i]);
		}
		res.json(unpublishedNews);
	},

	refreshViews: async (req, res) => {
		//counter views secara real time (setiap ada yang melihat berita langsung menambah)
		let news = await News.findById(req.params.id);
		if (!news)
			return res.json({
				message: `There is no news with id: ${req.params.id}`,
			});
		if (!news.date_publish)
			return res.json({ message: "This news is not published yet" });
		news.views += 1;
		news.save();
		res.json(news);
	},
	editNews: async (req, res) => {
		// edit berita (real)
		let news = await News.findById(req.params.id);
		const member = await Member.findOne({ username: req.body.username });

		if (!news)
			return res.json({
				message: `There is no news with id: ${req.params.id}`,
			});

		if (!member || member.roles === "RESTRICT")
			return res.json({ message: "Member doesn't exist!" });

		if (req.body.username !== news.owner.writer && member.roles !== "ADMIN")
			return res.json({
				message: "You are not Owner of this news",
			});

		news.title = req.body.title;
		news.tags = req.body.tags;
		news.category = req.body.category;
		news.description = req.body.description;
		news.date_publish = Date.now();

		try {
			const updatedNews = await news.save();
			res.json(updatedNews);
		} catch (error) {
			res.send(error);
		}
	},
	uploadNews: async (req, res) => {
		// post berita baru
		const member = await Member.findById(req.body.owner.writer_id);

		if (!member || member.roles === "RESTRICT")
			return res.json({ message: "Member doesn't exist!" });

		let news = new News({
			title: req.body.title,
			tags: req.body.tags,
			category: req.body.category,
			owner: {
				writer_id: req.body.owner.writer_id,
			},
			description: req.body.description,
		});

		try {
			news.owner.writer = member.username;
			news = await news.save();
			// res.redirect(`/news/${news._id}`);
			res.send(news);
		} catch (err) {
			console.log(err);
			// res.render(`news/new`, { news: news });
		}
	},
	deleteNews: async (req, res) => {
		const member = await Member.findOne({ username: req.body.username });
		const like = await Like.find({ news_id: req.params.id });
		try {
			const news = await News.findById(req.params.id);
			if (!news)
				return res.json({
					message: `There is no news with id: ${req.params.id}`,
				});

			if (!member || member.roles === "RESTRICT")
				return res.json({ message: "Member doesn't exist!" });

			if (member._id !== news.owner.writer_id && member.roles !== "ADMIN")
				return res.json({ message: "You are not owner of this news" });

			const deletedLike = await Like.deleteMany({ news_id: req.params.id });
			const deletedNews = await News.findByIdAndDelete(req.params.id);

			res.json(deletedNews);
		} catch (error) {
			res.send(error);
		}
	},
	refreshLike: async (req, res) => {
		// merefresh jumlah like pada suatu berita
		const numLike = await Like.find({ news_id: req.params.id }).count();
		// console.log(numLike);
		const news = await News.findByIdAndUpdate(req.params.id, {
			num_of_like: numLike,
		});

		if (!news)
			return res.json({
				message: `There is no news with id: ${req.params.id}`,
			});

		res.json(news);
	},
	publishNews: async (req, res) => {
		//publish berita
		const admin = await Member.findOne({ username: req.body.username });
		const news = await News.findById(req.params.id);

		if (!news)
			return res.json({
				message: `There is no news with id: ${req.params.id}`,
			});

		if (!admin || admin.roles === "RESTRICT")
			return res.json({ message: "Member doesn't exist!" });
		if (admin.roles !== "ADMIN")
			return res.json({ message: "You are not ADMIN" });
		try {
			news.owner.editor_id = admin._id;
			news.owner.editor = admin.username;
			news.date_publish = Date.now();
			news.views = 0;
			news.num_of_like = 0;
			news.save();
			res.json(news);
		} catch (error) {
			res.send(error);
		}
	},
	addComment: async (req, res) => {
		// komentar pada berita
		const member = await Member.findOne({ username: req.body.username });
		let news = await News.findById(req.params.id);

		if (!news)
			return res.json({
				message: `There is no news with id: ${req.params.id}`,
			});

		if (!member || member.roles === "RESTRICT")
			return res.json({ message: "Member doesn't exist!" });

		news.comment.push({
			member_id: member._id,
			username: member.username,
			date_comment: Date.now(),
			desc_comment: req.body.description,
		});

		try {
			const savedComment = await news.save();
			res.json(savedComment);
		} catch (error) {
			res.send(error);
		}
	},
	deleteComment: async (req, res) => {
		//delete Comment
		const member = await Member.findOne({ username: req.body.username });
		let news = await News.findById(req.params.id);

		if (!news)
			return res.json({
				message: `There is no news with id: ${req.params.id}`,
			});

		if (!member || member.roles === "RESTRICT")
			return res.json({ message: "Member doesn't exist" });
		if (member._id !== news.comment._id && member.roles !== "ADMIN")
			return res.json({
				message: "You are not Owner of this news",
			});
		const deletedComment = await News.updateOne(
			{ _id: news._id },
			{
				$pull: { comment: { _id: req.params.comment_id } },
			}
		);
		console.log(deletedComment);
		res.json(news);
	},
	editComment: async (req, res) => {
		// update comment
		const member = await Member.findOne({ username: req.body.username });
		let news = await News.findById(req.params.id);

		if (!news)
			return res.json({
				message: `There is no news with id: ${req.params.id}`,
			});

		if (!member || member.roles === "RESTRICT")
			return res.json({ message: "Member doesn't exist!" });
		if (member._id !== news.comment.member_id && member.roles !== "ADMIN")
			return res.json({
				message: "Only the owner can edit this comment",
			});

		const editedComment = await News.updateOne(
			{ _id: news._id, "comment._id": req.params.comment_id },
			{
				$set: {
					"comment.$.date_comment": Date.now(),
					"comment.$.desc_comment": req.body.desc_comment,
				},
			}
		);
		console.log(editedComment);
		res.json(news);
	},
	search: async (req, res) => {
		const query = await News.aggregate([
			{
				$match: { $text: { $search: req.body.query } },
			},
			{ $sort: { title: 1 } },
		]);
		res.json(query);
	},
};
