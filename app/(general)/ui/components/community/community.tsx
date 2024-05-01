import { Community } from "@prisma/client";
import Link from "next/link";

export function CardCommunity( { community } : { community: Community } ) {

    return (

        <div className="flex flex-row w-full items-center gap-4 relative group transition-all bg-card border-1 border-border group-hover/title:!border-white h-fit rounded-md px-6 py-6">

            {community.image 
                
                ?

                    <img src={community.image} alt={`Image of ${community.display_name}`} className={"rounded-md !max-w-[50px] !min-w-[50px] m-auto !h-[50px] !w-[50px] overflow-hidden bg-cover"} />

                :

                    <img src={"/text_post_icon.png"} alt={"This community has no image."} className="rounded-md hidden sm:flex sm:!max-w-[146px] sm:!min-w-[146px] m-auto sm:!h-[146px] sm:!w-[146px] overflow-hidden bg-cover" />

            }

            <div className="flex w-full bg-transparent h-fit flex-col">
                
                <Link href={`/c/${community.name}`} className="group/title w-fit font-sans font-semibold text-[18px] md:text-lg group-hover:text-gray-300 transition-all peer">{community.display_name}</Link>

                <p className='text-gray-300'>{community.description}</p>



            </div>

        </div>

    )

}