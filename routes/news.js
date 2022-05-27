import { Router } from "express";
import News from "../models/news";
import Member from "../models/member";
import { checkLogin } from "./validation";
const router = Router();
const member_id = localStorage.getItem("member_id");

router.post("/new", (req, res) => {
	res.render("news/new", { news: new News() });
});

router.get("/edit/:id", async (req, res) => {
	const news = await News.findById(req.params.id);

	res.render("news/edit", { news: news });
});

router.get("/:id", async (req, res) => {
	const news = await News.findById(req.params.id);

	if (news == null) res.redirect("/");
	req.render("news/show", { news: news });
});

router.post("/", async (req, res) => {
	let news = new News({
		title: req.body.title,
		tags: req.body.tags,
		categoty: req.body.categoty,
		owner: {
			writer_id: member_id,
		},
		description: req.body.description,
	});

	try {
		const member = await Member.findById(member_id);
		news.owner.writer = member.username;
		news = await news.save();
		res.redirect(`/news/${news._id}`);
	} catch (err) {
		console.log(err);
		res.render(`news/new`, { news: news });
	}
});

router.delete("/:id", async (req, res) => {
	await News.findByIdAndDelete(req.params.id);
	res.redirect("/");
});

export { router as default };
