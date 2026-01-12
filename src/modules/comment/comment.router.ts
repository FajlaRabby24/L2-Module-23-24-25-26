import { Router } from "express";
import { UserRoles } from "../../constant";
import { auth } from "../post/post.router";
import { commentController } from "./comment.controller";

const router = Router();

router.get("/:commentId", commentController.getCommentById);

router.get("/", commentController.getAllComment);

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

router.patch(
  "/:commentId",
  auth(UserRoles.USER, UserRoles.ADMIN),
  commentController.updateComment
);

router.patch(
  "/:commentId/moderate",
  auth(UserRoles.ADMIN),
  commentController.moderateComment
);

export const commentRouter = router;
