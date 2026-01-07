const createComment = (payload: {
  content: string;
  authorId: string;
  postId: string;
  parentId: string;
}) => {
  console.log("comment created!!", payload);
};

export const commentService = {
  createComment,
};
