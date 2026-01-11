import { Router } from "express";
import { UserRoles } from "../../constant";
import { auth } from "../post/post.router";
import { commentController } from "./comment.controller";

const router = Router();

router.get("/:commentId", commentController.getCommentById);

router.get("/author/:authorId", commentController.getCommentsByAuthor);

// create comment -> admin, user
router.post(
  "/",
  auth(UserRoles.ADMIN, UserRoles.USER),
  commentController.createComment
);

router.delete(
  "/:commentId",
  auth(UserRoles.USER, UserRoles.ADMIN),
  commentController.deleteComment
);

export const commentRouter = router;
