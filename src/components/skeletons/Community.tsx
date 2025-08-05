export function CardCommunitySkeleton() {
    return (
        <div className="flex flex-row w-full items-center gap-4 relative group transition-all bg-card border-0 border-border group-hover/title:!border-white h-fit rounded-sm px-6 py-6">
            <div className='bg-border rounded-sm animate-pulse !w-[50px] !h-[50px]' /> 
            <div className="flex w-full bg-transparent h-fit flex-col gap-1"> 
                <div className='bg-border rounded-sm animate-pulse !w-[75px] !h-[28px]' /> 
                <div className='bg-border rounded-sm animate-pulse !w-[290px] !h-[20px]' /> 
            </div>
        </div>
    );
}

export function CommunityInfobarSkeleton() {
    return (
        <div>
            <div className='flex-row gap-2 rounded-sm w-full bg-transparent'>
                <div className='flex-col bg-card p-6 border-0 border-border lg:px-48'>
                    <div className='flex flex-row gap-3 items-center'>
                        <div className='bg-border rounded-sm animate-pulse !w-[56px] !h-[56px]' />   
                        <div className='flex flex-col gap-1'>
                        <div className='bg-border rounded-sm animate-pulse !w-[110px] !h-[32px]' />      
                            <div className='bg-border rounded-sm animate-pulse !w-[300px] !h-[20px]' />   
                        </div>
                    </div>

                    <div className='flex flex-row gap-3 items-center mt-2'>
                        <div className='flex flex-row gap-3'>
                            <div className='bg-border rounded-sm animate-pulse !w-[248px] !h-[20px]' />   
                        </div>
                    </div>

                    <div className='flex flex-row gap-2 mt-4 mb-4'>
                        <div className='bg-border rounded-sm animate-pulse !w-[125px] !h-[38px]' />   
                        <div className='bg-border rounded-sm animate-pulse !w-[125px] !h-[38px]' />   
                        <div className='bg-border rounded-sm animate-pulse !w-[125px] !h-[38px]' />    
                    </div>
                </div>
            </div>  
        </div>
    );
}