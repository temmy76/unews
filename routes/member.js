import Member from "../models/member";
import { Router } from "express";
import { loginValidation, registerValidation } from "./validation";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();
router.post("/register", async (req, res) => {
	// untuk register
	const { error } = registerValidation(req.body);
	if (error) return res.send(error.details[0].message);

	const emailExist = await Member.findOne({ email: req.body.email });
	if (emailExist) return res.send("This email already exist!");

	const hashPassword = await bcrypt.hash(req.body.password, 10);

	const member = new Member({
		username: req.body.username,
		password: hashPassword,
		email: req.body.email,
	});

	try {
		const registeredMember = await member.save();
		res.json(registeredMember);
	} catch (err) {
		res.send(err);
	}
});

router.post("/login", async (req, res) => {
	// untuk login
	const { error } = loginValidation(req.body);
	if (error) return res.send(error.details[0].message);

	const member = await Member.findOne({ email: req.body.email });
	if (!member) return res.json({ message: "Member doesn't exist!" });

	const validPass = await bcrypt.compare(req.body.password, member.password);

	if (!validPass) return res.send("Your password is incorect");

	const token = jwt.sign({ id: member._id }, process.env.JWT_SECRET);

	res.json({ token: token });
	// res.redirect("index");
});

router.get("/", async (req, res) => {
	// mendapatkan semua list member
	const member = await Member.find();
	res.json(member);
});

router.put("/:id", async (req, res) => {
	// mengganti roles pada member (ADMIN, MEMBER, RESTRICT)
	try {
		const admin = await Member.findOne({ username: req.body.username });
		if (!admin || admin.roles === "RESTRICT")
			return res.json({ message: "Member doesn't exist!" });
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
