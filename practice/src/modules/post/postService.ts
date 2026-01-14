import {
  CommentStatus,
  Post,
  PostStatus,
} from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { UserRoles } from "../../constant";
import { prisma } from "../../lib/prisma";

const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">,
  authorId: string
) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId,
    },
  });

  return result;
};

// get posts
const getAllPost = async (
  search: string,
  tags: string[],
  isFeatured: boolean,
  authorId: string,
  page: number,
  limit: number,
  skip: number
) => {
  const andConditions: PostWhereInput[] = [];

  if (search) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (tags.length > 0) {
    andConditions.push({
      tags: {
        hasEvery: tags as string[],
      },
    });
  }

  if (typeof isFeatured === "boolean") {
    andConditions.push({
      isFetured: isFeatured,
    });
  }

  if (authorId) {
    andConditions.push({
      authorId,
    });
  }

  const result = await prisma.post.findMany({
    take: limit,
    skip,
    where: {
      AND: andConditions,
    },
  });

  const total = await prisma.post.count({
    where: {
      AND: andConditions,
    },
  });

  return {
    data: result,
    pagination: {
      total,
      limit,
      page,
      totalPage: Math.ceil(total / limit),
    },
  };
};

const getPostById = async (postId: string) => {
  const result = await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: postId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    return await tx.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        _count: {
          select: {
            comments: true,
          },
        },
        comments: {
          where: {
            parentId: null,
          },
          include: {
            replies: {
              include: {
                replies: {
                  include: {
                    replies: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  });

  return result;
};

const myAllPost = async (authorId: string) => {
  const userInfo = await prisma.user.findUnique({
    where: {
      id: authorId,
    },
  });

  if (userInfo?.status !== "ACTIVE") {
    throw new Error("You are not (ACTIVE) user!");
  }

  const result = await prisma.post.findMany({
    where: {
      authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // const total = await prisma.post.count({
  //   where: {
  //     authorId,
  //   },
  // });

  // * aggregate
  const total = await prisma.post.aggregate({
    _count: {
      id: true,
    },
    where: {
      authorId,
    },
  });

  return {
    data: result,
    total: total._count.id,
  };
};

/**
 * user -> sudhu nijar post update korte parbe, isFeatured update korte parbe na
 * admin -> sobar post update korte parbe
 */

const updatePost = async (
  postId: string,
  authorId: string,
  data: Partial<Post>,
  isAdmin: boolean
) => {
  const postData = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!postData) {
    throw new Error(`No post found by this id (${postId})`);
  }

  if (postData.authorId !== authorId) {
    throw new Error("You are not the owner/creator of the post!");
  }

  if (!isAdmin) {
    delete data.isFetured;
  }

  const result = await prisma.post.update({
    where: {
      id: postId,
    },
    data,
  });

  return result;
};

/**
 * 1. user -  nijer created post delte korte parbe
 * 2. admin - sobar post delte korte parbe
 */

const deletePost = async (
  postId: string,
  authorId: string,
  isAdmin: boolean
) => {
  const postData = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    select: {
      id: true,
      authorId: true,
    },
  });

  if (!postData) {
    throw new Error(`No post found by this id (${postId})`);
  }

  if (!isAdmin && postData.authorId !== authorId) {
    throw new Error("You are not the owner/creator of the post!");
  }

  const result = await prisma.post.delete({
    where: {
      id: postId,
    },
  });

  return result;
};

const getStats = async () => {
  const result = await prisma.$transaction(async (tx) => {
    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      archivedPosts,
      totalComments,
      approvedComments,
      rejectComments,
      totalUser,
      adminCount,
      userCount,
      totalViews,
    ] = await Promise.all([
      await tx.post.count(),
      await tx.post.count({ where: { status: PostStatus.PUBLISHED } }),
      await tx.post.count({ where: { status: PostStatus.DRAFT } }),
      await tx.post.count({ where: { status: PostStatus.ARCHIVED } }),
      await tx.comment.count(),
      await tx.comment.count({ where: { status: CommentStatus.APPROVED } }),
      await tx.comment.count({ where: { status: CommentStatus.REJECT } }),
      await tx.user.count(),
      await tx.user.count({ where: { role: UserRoles.ADMIN } }),
      await tx.user.count({ where: { role: UserRoles.USER } }),
      await tx.post.aggregate({ _sum: { views: true } }),
    ]);

    return {
      totalPosts,
      publishedPosts,
      draftPosts,
      archivedPosts,
      totalComments,
      approvedComments,
      rejectComments,
      totalUser,
      adminCount,
      userCount,
      totalViews: totalViews._sum.views,
    };
  });

  return result;
};

export const postService = {
  createPost,
  getAllPost,
  getPostById,
  myAllPost,
  updatePost,
  deletePost,
  getStats,
};
