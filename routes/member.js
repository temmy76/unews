import Member from "../models/member";
import { Router } from "express";
import { loginValidation, registerValidation } from "./validation";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();
router.post("/register", async (req, res) => {
	const { error } = registerValidation(req.body);
	if (error) return res.send(error.details[0].message);

	const emailExist = await Member.findOne({ email: req.body.email });
	if (emailExist) return res.send("This email already exist!");

	const hashPassword = await bcrypt.hash(req.body.password, 10);

	const member = new Member({
		username: req.body.username,
		password: hashPassword,
		email: req.body.email,
		roles: req.body.roles,
	});

	try {
		const test = await member.save();
		res.send(test);
	} catch (err) {
		res.send(err);
	}
});

router.post("/login", async (req, res) => {
	const { error } = loginValidation(req.body);
	if (error) return res.send(error.details[0].message);

	const member = await Member.findOne({ email: req.body.email });
	if (!member) return res.send("This member doesn't exist!");

	const validPass = await bcrypt.compare(req.body.password, member.password);

	if (!validPass) return res.send("Your password is incorect");

	const token = jwt.sign({ id: member._id }, process.env.JWT_SECRET);

	res.json({ token: token });
	res.redirect("index");
});

router.get("/", async (req, res) => {
	const member = await Member.find();
	res.send(member);
});

export { router as default };
