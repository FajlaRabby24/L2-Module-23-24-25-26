import { Router } from "express";
import { UserRoles } from "../../constant";
import { auth } from "../post/post.router";
import { commentController } from "./comment.controller";

const router = Router();

router.post(
  "/",
  auth(UserRoles.ADMIN, UserRoles.USER),
  commentController.createComment
);

export const commentRouter = router;
