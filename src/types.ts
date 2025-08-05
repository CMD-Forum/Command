/**
 * This is a file for all the types.
 */

import { Comment, Prisma } from "@prisma/client";

/**
 * PostAuthor
 * @memberof Post
 * @alias PostAuthor
 */

export interface PostAuthor {

    /**
     * ID of the author.
     */
    id: string;

    /**
     * Username of the author.
     */
    username: string;

    /**
     * When the authors account was created.
     */
    createdAt: Date;

    /**
     * When the authors account was last updated in the database.
     */
    updatedAt: Date;

    /**
     * The authors profile image source.
     */
    image: string | null;

    /**
     * The authors profile description.
     */
    description: string;

}

/**
 * PostCommunity
 * @memberof Post
 * @alias PostCommunity
 */
  
export interface PostCommunity {

    /**
     * The ID of the community.
     */
    id: string;

    /**
     * The name of the community.
     */
    name: string;

    /**
     * The description of the community.
     */
    description: string;

    /**
     * The image of the community.
     */
    image: string;

    /**
     * Whether the community is public or not.
     */
    public: boolean;

    admins: {
        userId: string
    }[]

}
  
// ---------------------------------------------------------------------------------------------------------------------------

/**
 * @namespace typedefs
 */

/**
 * 
 * @typedef Post
 * @memberof typedefs
 * 
 * @param {string} id ID of the post.
 * @param {Date} createdAt When the post was created.
 * @param {Date} updatedAt When the post was updated in the database.
 * @param {string} title Title of the post.
 * @param {string} content Main content of the post.
 * @param {string} tagline Tagline of the post.
 * @param {string} imageurl URL of the posts image, may be undefined or null.
 * @param {string} imagealt Alt tag of the posts image, may be undefined or null.
 * @param {boolean} public Whether the post is public or not.
 * @param {string} authorId The ID of the posts author.
 * @param {number} downvotes How many downvotes the post has.
 * @param {number} upvotes How many upvotes the post has.
 * @param {string} communityId The ID of the posts community.
 * @param {PostAuthor} author The author data of the post.
 * @param {PostCommunity} community The community data of the post.
 * 
 */

/**
 * Post
 * @alias Post
 */

/*export interface Post {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    content: string;
    tagline?: string; // Only optional to prevent errors, do not use.
    imageurl: string | undefined | null;
    imagealt: string | undefined | null;
    public: boolean;
    authorId?: string;
    downvotes: number;
    upvotes: number;
    communityId?: string;
    author: PostAuthor;
    community: PostCommunity;
    href?: string | null;
}*/

export type PostAPIResponse = Prisma.PostGetPayload<{
    include: { 
        author: {
            select: {
                id: true,
                username: true,
                createdAt: true,
                updatedAt: true,
                image: true,
                description: true,
            }
        },
        community: {
            select: {
                id: true,
                name: true,
                image: true,
                public: true,
                description: true,
            }
        }
    }
}>

/**
 * OpenGraph
 */

/**
 * 
 */

export type ogTwitterImage = {

    /**
     * The height of the image in pixels, e.g `"512"`.
     */

    height: string;
    
    /**
    * The full URL to the image.
    */
    
    url: string;
    
    /**
    * The width of the image in pixels, e.g `"1024"`.
    */
    
    width: string;

    /**
     * The alternate tag of the image. Used by screen readers for accessibility purposes.
     */

    alt: string;

}

/**
 * 
 */

export type ogImage = {

    /**
     * The height of the image in pixels, e.g `"512"`.
     */

    height: string;

    /**
     * The file type of the image, e.g `"image/png"`.
     */

    type: string;

    /**
     * The full URL to the image.
     */

    url: string;

    /**
     * The width of the image in pixels, e.g `"1024"`.
     */

    width: string;

    /**
     * The alternate tag of the image. Used by screen readers for accessibility purposes.
     */

    alt: string;

}

/**
 * 
 */

export type ogResult = {

    /**
     * Whether the data was retrieved successfully.
     */

    success: boolean;

    /**
     * Title of the webpage.
     */

    ogTitle: string;

    /**
     * Description of the webpage.
     */

    ogDescription: string;

    /**
     * Name of the entire website.
     */

    ogSiteName: string;

    /**
     * Whether the URL points to a website, music file, or video file.
     */

    ogType: string;

    /**
     * The type of card on Twitter.
     */

    twitterCard: "summary" | "summary_large_image" | "app" | "player";

    /**
     * The title on Twitter cards.
     */

    twitterTitle: string;

    /**
     * The description on Twitter cards.
     */

    twitterDescription: string;

    /**
     * Information about the OpenGraph image. See `ogImage` type.
     */

    ogImage: ogImage;

    /**
     * Information about the Twitter image. See `ogTwitterImage` type.
     */

    twitterImage: ogTwitterImage;

    /**
     * The locale of the webpage, e.g `"en"`, `"es"`, `"fr"`, etc.
     */

    ogLocale: string;

    /**
     * Path to the webpages favicon, relative to the websites root (`/`).
     */

    favicon: string;

    /**
     * The character set of the webpage, e.g `"utf-8"`.
     */

    charset: string;

    /**
     * The URL that the data is from.
     */

    requestUrl: string;

}

/**
 * Result of OGS Api Request.
 * @example
 *  const [ogData, setOgData] = useState<og>();

    useEffect(() => {
        setIsLoading(true);
        setError("");
        fetch("/api/ogs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ "url": "https://react.dev/" })
        })
        .then((res) => {
            res.json().then((body) => {
                if (res.status === 200) {
                    setOgData(body);
                    setIsLoading(false);
                } else {
                    setError("Sorry, this link couldn't be displayed.")
                    setIsLoading(false);
                }
            })
        })
    }, [url])
 */

export type og = {

    /**
     * Whether the request succeeded or failed. Either true or false.
     */

    error: boolean;

    /**
     * See `ogResult` type.
     */

    result: ogResult;

    /**
     * *From `openGraphScraper` GitHub:*
     * 
     * Response from the Fetch API.
     */

    response: JSON;

    /**
     * The HTML of the webpage.
     */

    html: string;
}

// Comments

export interface PostCommentType extends Comment {
    user: {
        id: string;
        username: string;
        image: string | null;
    }
}

// Error Handling

export interface DataFunctionError {
    error: {
        error: string;
        status: number;
    }
}