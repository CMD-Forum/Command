"use server";

import { prisma } from "./db";
import { logError, logMessage } from "./utils";

// getUserBy

export async function getUserById( id: string ) {

    const user = await prisma.user.findUnique({
        where: {
            id: id,
        },
    });

    return user;

}

export async function getUserByEmail( email: string ) {

    const user = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });

    return user;

}

export async function getUserByUsername( username: string ) {

    const user = await prisma.user.findUnique({
        where: {
            username: username,
        },
    });

    return user;

}

// getCommunityBy

export async function getCommunityById( id: string ) {

    const community = await prisma.community.findUnique({
        where: {
            id: id,
        },
    });

    return community;

}

export async function getCommunityByName( name: string ) {

    const community = await prisma.community.findUnique({
        where: {
            name: name,
        },
    });

    return community;

}

export async function getCommunityByDisplayName( display_name: string ) {

    const community = await prisma.community.findUnique({
        where: {
            display_name: display_name,
        },
    });

    return community;

}

// getCommunitySidebarInfo

export async function getCommunitySidebarInfo({ communityID }: { communityID: string }) {
    try {
        const dbCommunity = await prisma.community.findUnique({ 
            where: { 
              id: communityID
            },
            include: {
              admins: {
                select: {
                  createdAt: true,
                  updatedAt: true,
                  user: {
                    select: {
                      username: true,
                      description: true,
                      image: true,
                    },
                  },
                },
              },
            },
        });
        return dbCommunity
    } catch (error) {
        logError(error);
        return null;
    }
}

// getPost

export async function getPost({ postID }: { postID: string }) {

    const fetchedPost = await prisma.post.findUnique({
        where: {
          id: postID,
        },
        include: {
          community: {
            select: {
              id: true,
              display_name: true,
              name: true,
              image: true,
              public: true,
              description: true,
            },
          },
          author: {
            select: {
              id: true,
              username: true,
              description: true,
              image: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });

    return fetchedPost;

}

// createPost

interface createPostProps {

    title: string
    content: string
    imageurl?: string | null | undefined
    imagealt?: string | null | undefined
    authorId: string
    communityId: string
    href?: string;

}

export async function createPost( props: createPostProps ) {

    const post = await prisma.post.create({
        data: {
            title: props.title,
            content: props.content,
            imageurl: props.imageurl,
            imagealt: props.imagealt,
            authorId: props.authorId,
            communityId: props.communityId,
            href: props.href
        }
    });

    return post;

}

// deletePostAsAuthor

export async function deletePostAsAuthor({ postID, userID }: { postID: string, userID: string }) {
    
    const post = await prisma.post.findUnique({
        where: {
            id: postID,
        },
    });

    if ( post && post?.authorId === userID ) {
        try {

            await prisma.upvotes.deleteMany({
                where: {
                    postID: postID,
                },
            });

            await prisma.downvotes.deleteMany({
                where: {
                    postID: postID,
                },
            });

            await prisma.comment.deleteMany({
                where: {
                    postId: postID,
                },
            });

            const deletedPost = await prisma.post.delete({
                where: {
                    id: postID,
                },
            });

            return { success: "Post successfully deleted.", data: deletedPost, status: 200 }
        } catch ( error ) {
            logError(error);
            return { error: process.env.NODE_ENV === "development" ? `${error}` : "Something went wrong.", status: 500 };
        }
    } else if ( !post ) {
        return { error: "Post doesn't exist.", status: 404 }
    } else if ( post.authorId !== userID ) {
        return { error: "You are not authorized to delete this post.", status: 403 }
    }

}

// deletePostAsAdmin

export async function deletePostAsAdmin({ postID, userID }: { postID: string, userID: string }) {
    
    const post = await prisma.post.findUnique({
        where: {
            id: postID,
        },
        include: {
            community: {
                include: {
                    admins: {
                        select: {
                            userId: true,
                        }
                    }
                }
            }
        }
    });

    const authorized = post?.community.admins.some(admin => admin.userId === userID);

    if ( post && authorized ) {
        try {

            await prisma.upvotes.deleteMany({
                where: {
                    postID: postID,
                },
            });

            await prisma.downvotes.deleteMany({
                where: {
                    postID: postID,
                },
            });

            await prisma.comment.deleteMany({
                where: {
                    postId: postID,
                },
            });

            await prisma.moderationLog.create({
                data: {
                    adminId: userID,
                    communityId: post.community.id,
                    action: "DELETE_POST",
                    subjectType: "POST",
                    subjectId: post.id,
                },
            });

            const deletedPost = await prisma.post.delete({
                where: {
                    id: postID,
                },
            });

            return { success: "Post successfully deleted.", data: deletedPost, status: 200 }
        } catch ( error ) {
            logError(error);
            return { error: process.env.NODE_ENV === "development" ? `${error}` : "Something went wrong.", status: 500 };
        }
    } else if ( !post ) {
        return { error: "Post doesn't exist.", status: 404 }
    } else if ( !authorized ) {
        return { error: "You are not authorized to delete this post.", status: 403 }
    }

}

// getAllPosts

export async function getAllPostsFromUsername( username: string ) {
    
    const posts = await prisma.post.findMany({
        where: {
            author: {
                username: {
                    equals: username
                }
            }
        },
        include: {
            community: true,
            author: {
                select: {
                    username: true,
                    description: true,
                    name: true,
                    createdAt: true,
                    updatedAt: true,
                    image: true,
                }
            }
        }
    })

    return posts;

}

export async function getAllPostsFromCommunityID( id: string ) {
    
    const posts = await prisma.post.findMany({
        where: {
            community: {
                id: {
                    equals: id
                }
            }
        },
        include: {
            community: true,
            author: {
                select: {
                    username: true,
                    description: true,
                    name: true,
                    createdAt: true,
                    updatedAt: true,
                    image: true,
                }
            }
        }
    })

    return posts;

}

// createCommunity

/**
 * Creates a community with the given params.
 * @param name The name of the community (Display name, not DB name).
 * @param description The description of the community.
 * @param creatorUserID The UserID of the community creator.
 * @returns {Community}
 */

export async function createCommunity( { name, description, sidebar_md, creatorUserID }: { name: string, description: string, sidebar_md: string, creatorUserID: string } ) {

    const community = await prisma.community.create({
        data: {
            name: name.toLowerCase(),
            display_name: name,
            description: description,
            sidebar_md: sidebar_md,
        },
    });

    await prisma.communityAdminship.create({
        data: {
            userId: creatorUserID,
            communityId: community.id,
        },
    });

    return community;

}

// getCommunityAdminIDs

/**
 * Returns the IDs of all admins of the specified community.
 * @param communityId The ID of the community.
 * @returns {Community}
 * @deprecated 'getCommunityAdminIDs' is deprecated.
 */

export async function getCommunityAdminIDs( { communityId }: { communityId: string }) {

    const admins = await prisma.community.findUnique({
        where: {
            id: communityId,
        },
        select: {
            admin_ids: true,
        }
    });

    if (admins) { 
        return admins.admin_ids
    } else {
        logMessage("Community has no administrators.");
    }

}

// getCommunityAdmins

export async function getCommunityAdmins({ communityID }: { communityID: string }) {
    try {
        const admins = await prisma.communityAdminship.findMany({ 
            where: { 
                communityId: communityID 
            },
            include: {
                user: {
                    select: {
                        username: true,
                        image: true,
                        adminships: true,
                    },
                },
            },
        });

        return admins
    } catch (error) {
        logError(error);
        return null;
    }
}

// getAllCommunitys

/**
 * Returns all communitys.
 * @returns 
 */

export async function getAllCommunitys() {

    const communitys = await prisma.community.findMany();

    if (communitys) {   
        return communitys;
    } else {
        logMessage("No communities returned from database.");
    }

}

// updateUserMembership

export async function getAllUserMembershipRecords({ userID }: { userID: string }) {
    try {
        const userMemberships = await prisma.user.findUnique({
            where: {
                id: userID,
            },
            select: {
                memberships: {
                    select: {
                        community: true,
                    }
                },
            }
        });     
        return userMemberships;          
    } catch ( error ) {
        logError(error);
        return false;
    }
}

export async function createUserMembershipRecord({ userID, communityID }: { userID: string, communityID: string }) {

    try {
        const updatedAuthor = await prisma.user.update({
            where: {
                id: userID,
            },
            data: {
                memberships: {
                    create: {
                        communityId: communityID,
                    },
                },                    
            },
        });     
        return updatedAuthor;          
    } catch ( error ) {
        logError(error);
        return false;
    }

}

export async function deleteUserMembershipRecord({ userID, communityID }: { userID: string, communityID: string }) {

    try {
        const updatedRecord = await prisma.communityMembership.deleteMany({
            where: {
                userId: userID,
                communityId: communityID
            },
        });     
        return updatedRecord;          
    } catch ( error ) {
        logError(error);
        return false;
    }

}

export async function countCommunityMembers({ communityID }: { communityID: string }) {
    try {
        const communityMemberships = await prisma.communityMembership.count({
            where: {
                communityId: communityID,
            },
        });     
        return communityMemberships;          
    } catch ( error ) {
        logError(error);
        return undefined;
    }
}

export async function countCommunityPosts({ communityID }: { communityID: string }) {
    try {
        const communityPosts = await prisma.post.count({
            where: {
                communityId: communityID,
            },
        });     
        return communityPosts;          
    } catch ( error ) {
        logError(error);
        return undefined;
    }
}

// Upvotes

export async function checkIfVoted({ postID, userID }: { postID: string, userID: string }) {
    try {
        const upvote = await prisma.upvotes.findUnique({
            where: {
                upvoteID: { userID, postID },
            },
        });

        const downvote = await prisma.downvotes.findUnique({
            where: {
                downvoteID: { userID, postID },
            },
        });
        
        return { upvote: upvote ? true : false, downvote: downvote ? true : false }
    } catch ( error ) {
        logError(error);
        return { error: error }
    }
}

export async function upvote({ postID, userID }: { postID: string, userID: string }) {
    try {
        const upvote = await prisma.upvotes.create({
            data: {
                userID: userID,
                postID: postID,
            },
        });
        
        return { upvote }
    } catch ( error ) {
        logError(error);
        return { error: error }
    }
}

export async function downvote({ postID, userID }: { postID: string, userID: string }) {
    try {
        const downvote = await prisma.downvotes.create({
            data: {
                userID: userID,
                postID: postID,
            },
        });
        
        return { downvote }
    } catch ( error ) {
        logError(error);
        return { error: error }
    }
}

export async function removeUpvote({ postID, userID }: { postID: string, userID: string }) {
    try {
        await prisma.upvotes.delete({
            where: {
                upvoteID: { userID, postID },
            },
        });
        
        return { message: "Removed Successfully" }
    } catch ( error ) {
        logError(error);
        return { error: error }
    }
}

export async function removeDownvote({ postID, userID }: { postID: string, userID: string }) {
    try {
        await prisma.downvotes.delete({
            where: {
                downvoteID: { userID, postID },
            },
        });
        
        return { message: "Removed Successfully" }
    } catch ( error ) {
        logError(error);
        return { error: error }
    }
}

export async function getTotalUpvotes({ postID }: { postID: string }) {
    try {
        const upvotes = await prisma.upvotes.count({
            where: {
                postID: postID,
            },
        });
        
        return upvotes
    } catch ( error ) {
        logError(error);
        return { error: error }
    }
}

export async function getTotalDownvotes({ postID }: { postID: string }) {
    try {
        const downvotes = await prisma.downvotes.count({
            where: {
                postID: postID,
            },
        });
        
        return downvotes
    } catch ( error ) {
        logError(error);
        return { error: error }
    }
}

// Comments

export async function createComment({ postID, userID, content, replyTo }: { postID: string, userID: string, content: string, replyTo?: string }) {
    try {
        const newComment = await prisma.comment.create({
            data: {
                userId: userID,
                postId: postID,
                content: content,
                replyTo: replyTo || null,
            },
        });

        return newComment
    } catch ( error ) {
        logError(error);
        return { error: error }
    }
}

export async function deleteComment({ commentID }: { commentID: string }) {
    try {
        const deletedComment = await prisma.comment.update({
            where: {
                id: commentID,
            },
            data: {
                content: "[deleted]",
            },
        });

        return deletedComment
    } catch ( error ) {
        logError(error);
        return { error: error }
    }
}

export async function editComment({ commentID, content }: { commentID: string, content: string }) {
    try {
        const editedComment = await prisma.comment.update({
            where: {
                id: commentID,
            },
            data: {
                content: content,
                updatedAt: new Date(),
                edited: true,
            },
        });

        return editedComment
    } catch ( error ) {
        logError(error);
        return { error: error }
    }
}

export async function getPostComments({ postID }: { postID: string }) {
    try {
        const postComments = await prisma.comment.findMany({
            where: {
                postId: postID,
                replyTo: null,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        image: true,
                    }
                }
            }
        });

        return postComments
    } catch ( error ) {
        logError(error);
        return { error: error }
    }
}

export async function getComment({ commentID }: { commentID: string }) {
    try {
        const comment = await prisma.comment.findUnique({
            where: {
                id: commentID,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        image: true,
                    }
                }
            }
        });

        return comment
    } catch ( error ) {
        logError(error);
        return { error: error }
    }
}

export async function getUserComments({ userID }: { userID: string }) {
    try {
        const userComments = await prisma.comment.findMany({
            where: {
                userId: userID,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        image: true,
                    }
                }
            }
        });

        return userComments
    } catch ( error ) {
        logError(error);
        return { error: error }
    }
}

export async function createReply({ commentID, userID, postID, content }: { commentID: string, userID: string, postID: string, content: string }) {
    try {
        const reply = await prisma.comment.create({
            data: {
                userId: userID,
                postId: postID,
                content: content,
                replyTo: commentID,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        image: true,
                    }
                }
            }
        });

        return reply
    } catch ( error ) {
        logError(error);
        return { error: error }
    }
}

export async function getCommentReplies({ commentID }: { commentID: string }) {
    try {
        const replies = await prisma.comment.findMany({
            where: {
                replyTo: commentID,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        image: true,
                    }
                }
            }
        });

        return replies
    } catch ( error ) {
        logError(error);
        return { error: error }
    }
}

export async function checkIfReplies({ commentID }: { commentID: string }) {
    try {
        const replies = await prisma.comment.count({
            where: {
                replyTo: commentID,
            },
        });

        return replies
    } catch ( error ) {
        logError(error);
        return { error: error }
    }
}