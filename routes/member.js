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
	const role = req.body.roles.toUpperCase();
	const member = new Member({
		username: req.body.username,
		password: hashPassword,
		email: req.body.email,
		roles: role,
	});

	try {
		const registeredMember = await member.save();
		res.json(registeredMember);
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
	// res.redirect("index");
});

router.get("/", async (req, res) => {
	const member = await Member.find();
	res.json(member);
});

router.put("/:id", async (req, res) => {
	try {
		const admin = await Member.findOne({ username: req.body.username });
		if (!admin || admin.roles === "RESTRICT")
			return res.json({ message: "User didn't exist!" });
		if (admin.roles !== "ADMIN")
			return res.json({ message: "You are not ADMIN" });

		const member = await Member.findById(req.params.id);
		member.roles = req.body.roles.toUpperCase();
		member.save();
		console.log(member);
		res.json(member);
	} catch (err) {
		res.send(err);
	}
});

export { router as default };
