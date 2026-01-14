import { Request, Response } from "express";
import { UserRoles } from "../../constant";
import { sendResponse } from "../../utils/sendResponse";
import { postService } from "./postService";

// new post create
const createPost = async (req: Request, res: Response) => {
  try {
    const result = await postService.createPost(
      req.body,
      req.user?.id as string
    );
    sendResponse(res, 201, true, "post create successfully!", result);
  } catch (error) {
    sendResponse(res, 400, false, "post creation failed!", error);
  }
};

// get all post
const getAllPost = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];
    const isFeatured = req.query.isFeatured === "true" ? true : false;
    const authorId = req.query.authorId;

    const page: number = Number(req.query.page) || 1;
    const limit: number = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const result = await postService.getAllPost(
      search as string,
      tags,
      isFeatured,
      authorId as string,
      page,
      limit,
      skip
    );

    sendResponse(res, 200, true, "Posts retrived successfully!", result);
  } catch (error) {
    sendResponse(res, 400, false, "post creation failed!", error);
  }
};

// get post by id
const getPostById = async (req: Request, res: Response) => {
  try {
    const result = await postService.getPostById(req.params.postId as string);
    sendResponse(res, 200, true, "Post retrived successfully!", result);
  } catch (error) {
    sendResponse(res, 400, false, "post retrived failed!", error);
  }
};

const myAllPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const result = await postService.myAllPost(user?.id as string);
    sendResponse(res, 200, true, "Posts retrived successfully!", result);
  } catch (error) {
    const errorMess =
      error instanceof Error ? error.message : "Posts retrived failed!";
    sendResponse(res, 400, false, errorMess, error);
  }
};

const updatePost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("You are unauthorized!");
    }
    const isAdmin = user?.role === UserRoles.ADMIN;

    const result = await postService.updatePost(
      req.params.postId as string,
      user?.id as string,
      req.body,
      isAdmin
    );
    sendResponse(res, 200, true, "Posts update successfully!", result);
  } catch (error) {
    const errorMess =
      error instanceof Error ? error.message : "Posts retrived failed!";
    sendResponse(res, 400, false, errorMess, error);
  }
};

const deletePost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("You are unauthorized!");
    }
    const isAdmin = user.role === UserRoles.ADMIN;

    const postId = req.params.postId;

    const result = await postService.deletePost(
      postId as string,
      user?.id as string,
      isAdmin
    );

    sendResponse(res, 200, true, "Post deleted successfully!", result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "post delete failed";
    sendResponse(res, 400, false, errorMessage);
  }
};

const getStats = async (req: Request, res: Response) => {
  try {
    const result = await postService.getStats();

    sendResponse(res, 200, true, "Stats retrived successfully!", result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Stats retrived failed";
    sendResponse(res, 400, false, errorMessage);
  }
};

export const postController = {
  createPost,
  getAllPost,
  getPostById,
  myAllPost,
  updatePost,
  deletePost,
  getStats,
};
