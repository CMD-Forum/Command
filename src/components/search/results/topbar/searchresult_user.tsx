import Link from "next/link";

export default function SearchResult_User({ 
    userName, 
    userDescription, 
    userImage 
}: { 
    userName: string, 
    userDescription: string, 
    userImage: string
}) {
    return (
        <Link href={`/users/${userName}`} className="w-full transition-all flex items-center gap-4 hover:bg-BtnSecondary_Hover px-4 py-4">
            <img src={userImage} className="w-10 h-10 rounded-sm" alt={userName} />
            <div className="flex flex-col">
                <p className="text-md font-semibold">{userName}</p>
                <p className="text-sm font-normal text-secondary max-w-[413px] whitespace-nowrap overflow-hidden overflow-ellipsis">{userDescription}</p>
            </div>
        </Link>
    );
}