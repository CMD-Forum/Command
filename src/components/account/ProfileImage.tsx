"use client";

/**
 * Returns the profile image of a user.
 * @param {User} user
 * @param {number} imgSize Size of the image, in TailwindCSS units (1unit = 4px).
 * @example
 * <ProfileImage user={post.author} />
 */

export default function ProfileImage({ 
    user, 
    imgSize = "8", 
    measurement = "px",
    className
}: { 
    user: {
        image: string | null;
        username: string;
    } | null;
    imgSize?: string;
    measurement?: "units" | "px";
    className?: string;
}) {

    const SIZE = measurement === "units" ? `${0.25 * Number(imgSize)}rem` : `${imgSize}px`; // One unit in Tailwind is equal to 0.25rem, so we just multiply 0.25 by the imgSize.

    if (user) {
        if (user.image) {
            return (
                <img style={{width: SIZE, height: SIZE}} src={user.image} alt={`Profile Image of @${user.username}`} className={className} />
            );
        } else if (!user.image) {
            return (
                <img style={{width: SIZE, height: SIZE}} src="/ProfileImage.svg" alt={`Profile Image of @${user.username}`} className={className} />
            );            
        }    
    } else {
        return (
            <img style={{width: SIZE, height: SIZE}} src="/ProfileImage.svg" alt="Profile Image couldn't be loaded." className={className} />
        );
    }

}