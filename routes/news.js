import { Router } from "express";
import News from "../models/news";
import Member from "../models/member";
import Like from "../models/like";

const router = Router();

router.get("/", async (req, res) => {
	// index awal dengan berita yang sudah dipublish oleh editor
	// res.render("news/new", { news: new News() });
	const news = await News.find();
	let publishedNews = [];
	for (let i = 0; i < news.length; i++) {
		// console.log(news[i]);
		if (news[i].owner.editor) publishedNews.push(news[i]);
	}
	res.json(publishedNews);
});

router.get("/unpublished", async (req, res) => {
	// menampilkan post berita yang belum dipublish oleh editor
	const news = await News.find();
	let unpublishedNews = [];
	for (let i = 0; i < news.length; i++) {
		// console.log(news[i]);
		if (!news[i].owner.editor) unpublishedNews.push(news[i]);
	}
	res.json(unpublishedNews);
});

router.get("/feed/:id", async (req, res) => {
	//counter views secara real time (setiap ada yang melihat berita langsung menambah)
	let news = await News.findById(req.params.id);
	if (!news.date_publish)
		return res.json({ message: "This news is not published yet" });
	news.views += 1;
	news.save();
	res.json(news);
});

router.get("/edit/:id", async (req, res) => {
	// edit berita
	const news = await News.findById(req.params.id);
	res.render("news/edit", { news: news });
});

router.put("/feed/:id", async (req, res) => {
	// edit berita (real)
	let news = await News.findById(req.params.id);
	const member = await Member.findOne({ username: req.body.username });

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
});

router.post("/post", async (req, res) => {
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
});

router.delete("/:id", async (req, res) => {
	const news = await News.findByIdAndDelete(req.params.id);
	res.json(news);
	// res.redirect("/news");
});

router.post("/", async (req, res) => {
	// buat like dan unlike
	const member = Member.findById(req.body.member_id);

	if (!member || member.roles === "RESTRICT")
		return res.json({ message: "You are restricted to do anything" });

	let like = await Like.findOneAndDelete({
		news_id: req.body.news_id,
		member_id: req.body.member_id,
	});

	if (like == null) {
		let like = await Like.create({
			news_id: req.body.news_id,
			member_id: req.body.member_id,
		});
		res.json(like);
		return;
	}

	res.json({ message: "like dihapus" });
});

router.put("/:id", async (req, res) => {
	// merefresh jumlah like pada suatu berita
	const numLike = await Like.find({ news_id: req.params.id }).count();
	// console.log(numLike);
	const news = await News.findByIdAndUpdate(req.params.id, {
		num_of_like: numLike,
	});
	res.json(news);
});

router.put("/publish/:id", async (req, res) => {
	//publish berita
	const admin = await Member.findOne({ username: req.body.username });

	if (!admin || admin.roles === "RESTRICT")
		return res.json({ message: "Member doesn't exist!" });
	if (admin.roles !== "ADMIN")
		return res.json({ message: "You are not ADMIN" });
	try {
		const news = await News.findById(req.params.id);
		news.owner.editor_id = admin._id;
		news.owner.editor = admin.username;
		news.date_publish = Date.now();
		news.save();
		res.json(news);
	} catch (error) {
		res.send(error);
	}
});

router.put("/feed/comment/:id", async (req, res) => {
	// komentar pada berita
	const member = await Member.findOne({ username: req.body.username });
	let news = await News.findById(req.params.id);

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
});

router.put("/feed/comment/:id/:comment_id", async (req, res) => {
	const admin = await Member.findOne({ username: req.body.username });
	let news = await News.findById(req.params.id);

	if (!admin || admin.roles === "RESTRICT")
		return res.json({ message: "Member doesn't exist" });

	if (admin.roles !== "ADMIN")
		return res.json({ message: "You are not ADMIN" });
	const deletedComment = await News.updateOne(
		{ _id: news._id },
		{
			$pull: { comment: { _id: req.params.comment_id } },
		}
	);
	res.json(news);
});

router.put("/feed/comment/:id/edit/:comment_id", async (req, res) => {
	const member = await Member.findOne({ username: req.body.username });
	let news = await News.findById(req.params.id);

	if (!member || member.roles === "RESTRICT")
		return res.json({ message: "Member doesn't exist!" });

	const editedComment = await News.updateOne(
		{ _id: news._id, "comment._id": req.params.comment_id },
		{
			$set: {
				"comment.$.date_comment": Date.now(),
				"comment.$.desc_comment": req.body.desc_comment,
			},
		}
	);

	res.json(news);
});

export { router as default };
