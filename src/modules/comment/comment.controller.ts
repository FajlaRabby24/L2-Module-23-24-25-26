import { Request, Response } from "express";
import { commentService } from "./comment.service";

// create comment -> admin, user
const createComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    req.body.authorId = user?.id;
    const result = await commentService.createComment(req.body);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error,
    });
  }
};

// get comment by id
const getCommentById = async (req: Request, res: Response) => {
  try {
    const result = await commentService.getCommentById(
      req.params.commentId as string
    );

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Comment fetched failed!",
    });
  }
};

const getCommentsByAuthor = async (req: Request, res: Response) => {
  try {
    const result = await commentService.getCommentsByAuthor(
      req.params.authorId as string
    );

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Comment fetched failed!",
    });
  }
};

const deleteComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { commentId } = req.params;
    const result = await commentService.deleteComment(
      commentId as string,
      user?.id as string
    );
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      error: "Comment delete failed!",
      details: e,
    });
  }
};

export const commentController = {
  createComment,
  getCommentById,
  getCommentsByAuthor,
  deleteComment,
};
