import { Router } from "express";
import memberController from "../controllers/memberControllers";
import Member from "../models/memberModels";
const router = Router();

router.get("/", memberController.getAllMember);

// router.get("/register", (req, res) => {
// 	res.render("member/register", { member: new Member() });
// });

// router.get("/login", (req, res) => {
// 	res.render("member/login", { member: new Member() });
// });

router.get("/search", memberController.search);

router.post("/register", memberController.register);

router.post("/login", memberController.login);

router.put("/:id", memberController.changeRoles);

//delete account
router.delete("/:id", memberController.delete);

//ganti password

export { router as default };
