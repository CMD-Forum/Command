"use server";

/**
 * This entire file is being scrapped at some point soon. It is bloated, ugly and outdated.
 */



import { Community } from "@prisma/client";
import { headers } from "next/headers";
import { auth } from "./auth/auth";
import { db } from "./db";
import { legacy_logError } from "./utils";

// getUserBy

export async function getUserById( id: string ) {
    "use cache";

    const user = await db.user.findUnique({
        where: {
            id: id,
        },
    });

    return user;

}

export async function getUserByEmail( email: string ) {
    "use cache";

    const user = await db.user.findUnique({
        where: {
            email: email,
        },
    });

    return user;

}

export async function getUserByUsername( username: string ) {
    "use cache";

    const user = await db.user.findUnique({
        where: {
            username: username,
        },
    });

    return user;

}

// getCommunityBy

export async function getCommunityById( id: string ) {
    "use cache";

    const community = await db.community.findUnique({
        where: {
            id: id,
        },
    });

    return community;

}

export async function checkCommunityExistsByName( name: string ) {
    const community = await db.community.count({ where: { name: name } });

    if (community >= 1) return true;
    else return false;
}

export async function getCommunityByName( name: string ) {

    const community = await db.community.findUnique({
        where: {
            name: name,
        },
    });

    return community;

}

// getCommunitySidebarInfo

export async function getCommunitySidebarInfo({ communityID }: { communityID: string }) {
    "use cache";
    
    try {
        const dbCommunity = await db.community.findUnique({ 
            where: { 
              id: communityID
            },
            include: {
              moderators: {
                select: {
                  createdAt: true,
                  User: {
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
        legacy_logError(error);
        return null;
    }
}

// getPost

export async function getPost({ postID }: { postID: string }) {

    const SESSION = await auth.api.getSession({
        headers: await headers(),
    });
    
    const POST_PUBLICITY = await getPostPublicity({ postID: postID });
    if (POST_PUBLICITY.userCanView === false) return { error: "Post is private.", errorCode: SESSION?.user.id ? 403 : 401 }

    //const CACHE_KEY = `posts:data:${postID}`;
    //const CACHED_POST = await redis.get(CACHE_KEY);
  
    //if (CACHED_POST) return JSON.parse(CACHED_POST); 

    const FETCHED_POST = await db.post.findUnique({
        where: {
            id: postID,
        },
        include: {
            community: {
                select: {
                    id: true,
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
  
    //await redis.set(CACHE_KEY, JSON.stringify(FETCHED_POST), { EX: 1800 });
  
    return { response: FETCHED_POST, error: null, errorCode: null };
}

export async function getPostPublicity({ postID }: { postID: string }) {
    const SESSION = await auth.api.getSession({
        headers: await headers(),
    });

    // const CACHE_KEY = `posts:publicity:${postID}`;
    // const CACHED_VALUE = await redis.get(CACHE_KEY);

    /*if (CACHED_VALUE === "true") return { publicity: true, userCanView: true };
    else if (CACHED_VALUE === "false") {
        const POST = await db.post.findUnique({
            where: {
                id: postID
            },
            select: {
                authorId: true
            }
        })
        return { publicity: false, userCanView: POST?.authorId === SESSION?.user?.id ? true : false };    
    }
    else {*/
        const FETCHED_PUBLICITY_VALUE = await db.post.findUnique({
            where: {
                id: postID,
            },
            select: {
                public: true,
                authorId: true,
            },
        });
    
        //await redis.set(CACHE_KEY, FETCHED_PUBLICITY_VALUE?.public === true ? "true" : "false", { EX: 1800 });
        return { 
            publicity: FETCHED_PUBLICITY_VALUE?.public, 
            userCanView: FETCHED_PUBLICITY_VALUE?.public === true ? true : (FETCHED_PUBLICITY_VALUE?.authorId === SESSION?.user?.id) 
        };
    //}
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

    const post = await db.post.create({
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
    
    const post = await db.post.findUnique({
        where: {
            id: postID,
        },
    });

    if ( post && post?.authorId === userID ) {
        try {

            await db.upvotes.deleteMany({
                where: {
                    postID: postID,
                },
            });

            await db.downvotes.deleteMany({
                where: {
                    postID: postID,
                },
            });

            await db.comment.deleteMany({
                where: {
                    postId: postID,
                },
            });

            const deletedPost = await db.post.delete({
                where: {
                    id: postID,
                },
            });

            return { success: "Post successfully deleted.", data: deletedPost, status: 200 }
        } catch ( error ) {
            legacy_logError(error);
            return { error: process.env.NODE_ENV === "development" ? `${error}` : "Something went wrong.", status: 500 };
        }
    } else if ( !post ) {
        return { error: "Post doesn't exist.", status: 404 }
    } else if ( post.authorId !== userID ) {
        return { error: "You are not authorized to delete this post.", status: 403 }
    }

}

// deletePostAsAdmin

export async function deletePostAsAdmin({ postID, userID, communityID }: { postID: string, userID: string, communityID: string }) {
    
    const post = await db.post.findUnique({
        where: {
            id: postID,
        },
        include: {
            community: {
                include: {
                    moderators: {
                        select: {
                            userID: true,
                        }
                    }
                }
            }
        }
    });

    const IS_MODERATOR = await db.communityModerator.findFirst({ where: { userID: userID, communityID: communityID } });

    if (post && IS_MODERATOR) {
        try {

            await db.upvotes.deleteMany({
                where: {
                    postID: postID,
                },
            });

            await db.downvotes.deleteMany({
                where: {
                    postID: postID,
                },
            });

            await db.comment.deleteMany({
                where: {
                    postId: postID,
                },
            });

            await db.moderationLog.create({
                data: {
                    adminId: userID,
                    communityId: communityID,
                    action: "DELETE_POST",
                    subjectType: "POST",
                    subjectId: post.id,
                },
            });

            const deletedPost = await db.post.delete({
                where: {
                    id: postID,
                },
            });

            return { success: "Post successfully deleted.", data: deletedPost, status: 200 }
        } catch ( error ) {
            legacy_logError(error);
            return { error: process.env.NODE_ENV === "development" ? `${error}` : "Something went wrong.", status: 500 };
        }
    } else if ( !post ) {
        return { error: "Post doesn't exist.", status: 404 }
    } else if ( !IS_MODERATOR ) {
        return { error: "You are not authorized to delete this post.", status: 403 }
    }

}

// getAllPosts

export async function getAllPostsFromUsername( username: string ) {
    "use cache";
    
    const posts = await db.post.findMany({
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
    "use cache";
    
    const posts = await db.post.findMany({
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
 * Creates a community with the given parameters.
 * @param name The name of the community (Display name, not DB name).
 * @param description The description of the community.
 * @param creatorUserID The UserID of the community creator.
 * @returns {Community}
 */

export async function createCommunity( { name, description, creatorUserID }: { name: string, description: string, creatorUserID: string } ) {

    const community = await db.community.create({
        data: {
            name: name.toLowerCase(),
            description: description,
        },
    });

    await db.communityModerator.create({
        data: {
            userID: creatorUserID,
            communityID: community.id,
        },
    });

    return community;

}

export async function CreateCommunityFromData( { communityData, creatorUserID }: { communityData: Partial<Community>, creatorUserID: string } ) {
    const community = await db.community.create({ data: communityData });

    await db.communityModerator.create({
        data: {
            userID: creatorUserID,
            communityID: community.id,
        },
    });

    return community;
}

// getCommunityAdmins

export async function getCommunityAdmins({ communityID }: { communityID: string }) {
    "use cache";

    try {
        const admins = await db.communityModerator.findMany({ 
            where: { 
                communityID: communityID 
            },
            include: {
                User: {
                    select: {
                        username: true,
                        image: true,
                    },
                },
            },
        });

        return admins
    } catch (error) {
        legacy_logError(error);
        return null;
    }
}

// getAllCommunitys

/**
 * Returns all communitys.
 * @returns 
 */

export async function getAllCommunitys() {
    const COMMUNITIES = await db.community.findMany();

    if (COMMUNITIES) return { error: null, communitys: COMMUNITIES };
    else return { error: "No communities were found.", communitys: null }
}

// updateUserMembership

export async function getAllUserMembershipRecords({ userID }: { userID: string }) {
    "use cache";

    try {
        const userMemberships = await db.user.findUnique({
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
        legacy_logError(error);
        return false;
    }
}

export async function createUserMembershipRecord({ userID, communityID }: { userID: string, communityID: string }) {

    try {
        const updatedAuthor = await db.user.update({
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
        legacy_logError(error);
        return false;
    }

}

export async function deleteUserMembershipRecord({ userID, communityID }: { userID: string, communityID: string }) {

    try {
        const updatedRecord = await db.communityMembership.deleteMany({
            where: {
                userId: userID,
                communityId: communityID
            },
        });     
        return updatedRecord;          
    } catch ( error ) {
        legacy_logError(error);
        return false;
    }

}

export async function countCommunityMembers({ communityID }: { communityID: string }) {
    "use cache";

    try {
        const communityMemberships = await db.communityMembership.count({
            where: {
                communityId: communityID,
            },
        });     
        return communityMemberships;          
    } catch ( error ) {
        legacy_logError(error);
        return undefined;
    }
}

export async function countCommunityPosts({ communityID }: { communityID: string }) {
    "use cache";
    
    try {
        const communityPosts = await db.post.count({
            where: {
                communityId: communityID,
            },
        });     
        return communityPosts;          
    } catch ( error ) {
        legacy_logError(error);
        return undefined;
    }
}

// Upvotes

export async function checkIfVotedOnPost({ postID, userID }: { postID: string, userID: string }) {
    try {
        const upvote = await db.upvotes.count({ where: { userID: userID, postID: postID }});
        const downvote = await db.downvotes.count({ where: { userID: userID, postID: postID }});
        
        return { upvote: upvote > 0 ? true : false, downvote: downvote > 0 ? true : false }
    } catch (error) {
        legacy_logError(error);
        return { error: error }
    }
}

export async function checkIfVotedOnComment({ commentID, userID }: { commentID: string, userID: string }) {
    try {
        const upvote = await db.commentUpvotes.count({ where: { userID: userID, commentID: commentID }});
        const downvote = await db.commentDownvotes.count({ where: { userID: userID, commentID: commentID }});
        
        return { upvote: upvote > 0 ? true : false, downvote: downvote > 0 ? true : false }
    } catch (error) {
        legacy_logError(error);
        return { error: error }
    }
}

// Downvote + upvote

export async function upvotePost({ postID, userID }: { postID: string, userID: string }) {
    try {
        const upvote = await db.upvotes.create({
            data: {
                userID: userID,
                postID: postID,
            },
        });
        
        return { upvote }
    } catch (error) {
        legacy_logError(error);
        return { error: error }
    }
}

export async function downvotePost({ postID, userID }: { postID: string, userID: string }) {
    try {
        const downvote = await db.downvotes.create({
            data: {
                userID: userID,
                postID: postID,
            },
        });
        
        return { downvote }
    } catch ( error ) {
        legacy_logError(error);
        return { error: error }
    }
}

export async function upvoteComment({ commentID, userID }: { commentID: string, userID: string }) {
    try {
        const upvote = await db.commentUpvotes.create({
            data: {
                userID: userID,
                commentID: commentID,
            },
        });
        
        return { upvote }
    } catch (error) {
        legacy_logError(error);
        return { error: error }
    }
}

export async function downvoteComment({ commentID, userID }: { commentID: string, userID: string }) {
    try {
        const downvote = await db.commentDownvotes.create({
            data: {
                userID: userID,
                commentID: commentID,
            },
        });
        
        return { downvote }
    } catch ( error ) {
        legacy_logError(error);
        return { error: error }
    }
}

// Remove Downvote

export async function removePostUpvote({ postID, userID }: { postID: string, userID: string }) {
    try {
        await db.upvotes.delete({
            where: {
                upvoteID: { userID, postID },
            },
        });
        
        return { message: "Removed Successfully" }
    } catch ( error ) {
        legacy_logError(error);
        return { error: error }
    }
}

export async function removePostDownvote({ postID, userID }: { postID: string, userID: string }) {
    try {
        await db.downvotes.delete({
            where: {
                downvoteID: { userID, postID },
            },
        });
        
        return { message: "Removed Successfully" }
    } catch ( error ) {
        legacy_logError(error);
        return { error: error }
    }
}

export async function removeCommentUpvote({ commentID, userID }: { commentID: string, userID: string }) {
    try {
        await db.commentUpvotes.delete({
            where: {
                commentID_userID: { userID, commentID },
            },
        });
        
        return { message: "Removed Successfully" }
    } catch (error) {
        legacy_logError(error);
        return { error: error }
    }
}

export async function removeCommentDownvote({ commentID, userID }: { commentID: string, userID: string }) {
    try {
        await db.commentDownvotes.delete({
            where: {
                commentID_userID: { userID, commentID },
            },
        });
        
        return { message: "Removed Successfully" }
    } catch ( error ) {
        legacy_logError(error);
        return { error: error }
    }
}

// Get

export async function getTotalPostUpvotes({ postID }: { postID: string }) {
    try {
        const upvotes = await db.upvotes.count({
            where: {
                postID: postID,
            },
        });
        
        return upvotes
    } catch ( error ) {
        legacy_logError(error);
        return { error: error }
    }
}

export async function getTotalPostDownvotes({ postID }: { postID: string }) {
    try {
        const downvotes = await db.downvotes.count({
            where: {
                postID: postID,
            },
        });
        
        return downvotes
    } catch ( error ) {
        legacy_logError(error);
        return { error: error }
    }
}

export async function getTotalCommentUpvotes({ commentID }: { commentID: string }) {
    try {
        const upvotes = await db.commentUpvotes.count({
            where: {
                commentID: commentID,
            },
        });
        
        return upvotes
    } catch (error) {
        legacy_logError(error);
        return { error: error }
    }
}

export async function getTotalCommentDownvotes({ commentID }: { commentID: string }) {
    try {
        const downvotes = await db.commentDownvotes.count({
            where: {
                commentID: commentID,
            },
        });
        
        return downvotes
    } catch (error) {
        legacy_logError(error);
        return { error: error }
    }
}

// Comments

export async function createComment({ postID, userID, content, replyTo }: { postID: string, userID: string, content: string, replyTo?: string }) {
    try {
        const newComment = await db.comment.create({
            data: {
                userId: userID,
                postId: postID,
                content: content,
                replyTo: replyTo || null,
            },
        });

        return newComment
    } catch ( error ) {
        legacy_logError(error);
        return { error: error }
    }
}

export async function deleteComment({ commentID }: { commentID: string }) {
    try {
        const deletedComment = await db.comment.update({
            where: {
                id: commentID,
            },
            data: {
                content: "[deleted]",
            },
        });

        return deletedComment
    } catch ( error ) {
        legacy_logError(error);
        return { error: error }
    }
}

export async function editComment({ commentID, content }: { commentID: string, content: string }) {
    try {
        const editedComment = await db.comment.update({
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
        legacy_logError(error);
        return { error: error }
    }
}

export async function getPostComments({ postID }: { postID: string }) {
    try {
        const postComments = await db.comment.findMany({
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
        legacy_logError(error);
        return { error: error }
    }
}

export async function getComment({ commentID }: { commentID: string }) {
    try {
        const COMMENT = await db.comment.findUnique({
            where: {
                id: commentID,
            },
            include: {
                post: {
                    select: {
                        id: true
                    },
                },
                user: {
                    select: {
                        id: true,
                        username: true,
                        image: true,
                    }
                }
            }
        });

        return { comment: COMMENT, error: null }
    } catch (error) {
        legacy_logError(error);
        const ERROR_MESSAGE = error instanceof Error ? error.message : String(error);
        return { comment: null, error: ERROR_MESSAGE }
    }
}

export async function getUserComments({ userID }: { userID: string }) {
    try {
        const USER_COMMENTS = await db.comment.findMany({
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

        return { userComments: USER_COMMENTS, error: null }
    } catch (error) {
        legacy_logError(error);
        const ERROR_MESSAGE = error instanceof Error ? error.message : String(error);
        return { userComments: null, error: ERROR_MESSAGE }
    }
}

export async function createReply({ commentID, userID, postID, content }: { commentID: string, userID: string, postID: string, content: string }) {
    try {
        const reply = await db.comment.create({
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
        legacy_logError(error);
        return { error: error }
    }
}

export async function getCommentReplies({ commentID }: { commentID: string }) {
    try {
        const replies = await db.comment.findMany({
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
        legacy_logError(error);
        return { error: error }
    }
}

export async function checkIfReplies({ commentID }: { commentID: string }) {
    try {
        const replies = await db.comment.count({
            where: {
                replyTo: commentID,
            },
        });

        return replies
    } catch ( error ) {
        legacy_logError(error);
        return { error: error }
    }
}