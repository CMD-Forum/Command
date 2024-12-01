-- CreateTable
CREATE TABLE "CommentUpvotes" (
    "userID" TEXT NOT NULL,
    "commentID" TEXT NOT NULL,

    CONSTRAINT "CommentUpvotes_pkey" PRIMARY KEY ("commentID","userID")
);

-- CreateTable
CREATE TABLE "CommentDownvotes" (
    "userID" TEXT NOT NULL,
    "commentID" TEXT NOT NULL,

    CONSTRAINT "CommentDownvotes_pkey" PRIMARY KEY ("commentID","userID")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "replyTo" TEXT,
    "content" TEXT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Comment_id_key" ON "Comment"("id");

-- AddForeignKey
ALTER TABLE "CommentUpvotes" ADD CONSTRAINT "CommentUpvotes_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentUpvotes" ADD CONSTRAINT "CommentUpvotes_commentID_fkey" FOREIGN KEY ("commentID") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentDownvotes" ADD CONSTRAINT "CommentDownvotes_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentDownvotes" ADD CONSTRAINT "CommentDownvotes_commentID_fkey" FOREIGN KEY ("commentID") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
