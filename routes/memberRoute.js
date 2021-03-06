import { Router } from "express";
import memberController from "../controllers/memberControllers";

const router = Router();

router.get("/", memberController.getAllMember);

router.get("/search", memberController.search);

router.post("/register", memberController.register);

router.post("/login", memberController.login);

router.put("/update/:id", memberController.editProfile);

router.put("/:id", memberController.changeRoles);

router.delete("/:id", memberController.delete);

export { router as default };
