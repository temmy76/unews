import { Router } from "express";
import News from "../models/news";
import Member from "../models/member";
import Like from "../models/like";
import jwt from "jsonwebtoken";

const router = Router();

router.get("/", (req, res) => {
	// index
	// res.render("news/new", { news: new News() });
	res.send("TEST");
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
	await News.findByIdAndDelete(req.params.id);
	res.redirect("/news");
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

	res.json("terhapus");
});

router.put("/:id", async (req, res) => {
	const numLike = await Like.find({ news_id: req.params.id }).count();
	// console.log(numLike);
	const news = await News.findByIdAndUpdate(req.params.id, {
		num_of_like: numLike,
	});
	res.json(news);
});

export { router as default };
