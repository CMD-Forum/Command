import Link from "next/link";

export default function SearchResult_Community({ 
    communityName, 
    communityDescription, 
    communityImage 
}: { 
    communityName: string, 
    communityDescription: string, 
    communityImage: string
}) {
    return (
        <Link href={`/c/${communityName.toLowerCase()}`} className="w-full transition-all flex items-center gap-4 hover:bg-BtnSecondary_Hover px-4 py-3">
            <img src={communityImage} className="w-10 h-10 rounded-sm" alt={communityName} />
            <div className="flex flex-col">
                <p className="text-md font-semibold">{communityName}</p>
                <p className="text-sm font-normal text-secondary max-w-[413px] whitespace-nowrap overflow-hidden overflow-ellipsis">{communityDescription}</p>                
            </div>
        </Link>
    );
}