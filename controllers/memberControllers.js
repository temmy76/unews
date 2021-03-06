import Member from "../models/memberModels";
import { loginValidation, registerValidation } from "../validation";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default {
	register: async (req, res) => {
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
			// res.redirect("/member");
		} catch (err) {
			res.send(err);
		}
	},

	login: async (req, res) => {
		// untuk login
		const { error } = loginValidation(req.body);
		if (error) return res.send(error.details[0].message);

		const member = await Member.findOne({ email: req.body.email });
		if (!member) return res.json({ message: "Member doesn't exist!" });

		const validPass = await bcrypt.compare(req.body.password, member.password);

		if (!validPass) return res.send("Your password is incorect");

		const token = jwt.sign({ id: member._id }, process.env.JWT_SECRET);

		res.json({ message: `Welcome to Unews, ${member.username}`, token: token });
		// res.send(token);
	},

	getAllMember: async (req, res) => {
		// mendapatkan semua list member
		const member = await Member.find();
		res.json(member);
		// res.render("member/index", { members: member });
	},

	changeRoles: async (req, res) => {
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
	},
	search: async (req, res) => {
		const query = await Member.aggregate([
			{
				$match: { $text: { $search: req.body.query } },
			},
			{ $sort: { username: 1 } },
		]);

		res.json(query);
	},
	delete: async (req, res) => {
		const admin = await Member.findOne({ username: req.body.username });

		if (!admin || admin.roles === "RESTRICT")
			return res.json({ message: "Member doesn't exist!" });

		if (admin._id != req.params.id && admin.roles !== "ADMIN")
			return res.json({ message: "You are not ADMIN" });
		try {
			const deletedMember = await Member.findByIdAndDelete(req.params.id);
			res.json(deletedMember);
		} catch (e) {
			res.json(e);
		}
	},
	editProfile: async (req, res) => {
		const member = await Member.findById(req.params.id);
		if (!member) return res.json({ message: "Member doesn't exist!" });

		req.body.username === undefined ? member.username : req.body.username;
		req.body.email === undefined ? member.email : req.body.email;

		if (req.body.password === undefined) {
			req.body.password = member.password;
		} else {
			req.body.password = await bcrypt.hash(req.body.password, 10);
		}
		try {
			const updatedMember = await Member.findByIdAndUpdate(req.params.id, {
				username: req.body.username,
				password: req.body.password,
				email: req.body.email,
			});

			res.json(updatedMember);
		} catch (error) {
			res.send(error);
		}
	},
};
