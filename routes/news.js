import { Router } from "express";
import News from "../models/news";
import Member from "../models/member";
import Like from "../models/like";
import jwt from "jsonwebtoken";

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

router.get("/berita/:id", async (req, res) => {
	//counter views secara real time (setiap ada yang melihat berita langsung menambah)
	let news = await News.findById(req.params.id);
	news.views += 1;
	news.save();
	res.json(news);
});

router.get("/edit/:id", async (req, res) => {
	// edit berita
	const news = await News.findById(req.params.id);
	res.render("news/edit", { news: news });
});

router.get("/:id", async (req, res) => {
	// buat ngeliat page berita
	const news = await News.findById(req.params.id);

	if (news == null) res.redirect("/");
	req.render("news/show", { news: news });
});

router.post("/post", async (req, res) => {
	// post berita baru
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
		const member = await Member.findById(news.owner.writer_id);
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

	res.json("like dihapus");
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

	if (!admin) return res.json({ message: "User didn't exist" });
	if (admin.roles !== "ADMIN")
		return res.json({ message: "You are not ADMIN" });
	const news = await News.findById(req.params.id);
	news.owner.editor_id = admin._id;
	news.owner.editor = admin.username;
	news.date_publish = Date.now();
	news.save();
	res.json(news);
});

export { router as default };
