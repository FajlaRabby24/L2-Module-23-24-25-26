import { Router } from "express";
import { UserRoles } from "../../constant";
import { auth } from "../../middleware/auth";
import { postController } from "./postController";

const router = Router();

router.get("/", postController.getAllPost);

router.get("/stats", auth(UserRoles.ADMIN), postController.getStats);

router.get(
  "/my-posts",
  auth(UserRoles.ADMIN, UserRoles.USER),
  postController.myAllPost
);

router.get("/:postId", postController.getPostById);

router.post(
  "/",
  auth(UserRoles.ADMIN, UserRoles.USER),
  postController.createPost
);

router.patch(
  "/:postId",
  auth(UserRoles.ADMIN, UserRoles.USER),
  postController.updatePost
);

router.delete(
  "/:postId",
  auth(UserRoles.ADMIN, UserRoles.USER),
  postController.deletePost
);

export const postRouter = router;
