/**
 * ## FullPostSkeleton
 * ---
 * Skeleton for the `FullPost` component.
 */

export function FullPostSkeleton() {
    return (
        <div className="rounded-sm flex w-full bg-transparent h-fit facebookTheme:rounded-sm-none mt-4">
            <div className="flex w-full bg-transparent h-fit flex-col">
                <div className="text-sm relative md:bg-card md:p-6 rounded-sm">
                    <div className='flex flex-row gap-2 items-center'>
                    <div className='bg-border rounded-sm animate-pulse !w-8 !h-8' /> 
                        <div className='flex flex-col justify-center'>
                            <div className='bg-border rounded-sm animate-pulse !w-[60px] !h-[20px]' /> 
                            <div className="flex flex-row">
                                <h4 className="w-fit flex gap-2">
                                    <div className='bg-border rounded-sm animate-pulse !w-[90px] !h-[20px] mt-1' /> 
                                    <div className='bg-border rounded-sm animate-pulse !w-[142px] !h-[20px] mt-1' />
                                </h4>   
                            </div>                                   
                        </div>                            
                    </div>
                    <div className='bg-border rounded-sm animate-pulse !w-[280px] !h-[28px] mt-1' />
                </div>
                
                <div className='md:bg-card w-full h-fit md:p-6 rounded-sm mt-2 md:mt-6'>
                    <div className='flex flex-col gap-1'>
                        <div className='bg-border rounded-sm animate-pulse !w-[125px] !h-[38px]' /> 
                        <div className='bg-border rounded-sm animate-pulse !w-[300px] !h-[20px]' /> 
                        <div className='bg-border rounded-sm animate-pulse !w-[300px] !h-[20px]' /> 
                    </div>                        
                </div>


                <div className='flex flex-row gap-2 md:bg-card w-full h-fit md:p-6 rounded-sm mt-2 md:mt-6'>
                    <div className='bg-border rounded-sm animate-pulse !w-[165px] !h-[38px]' /> 
                    <div className='bg-border rounded-sm animate-pulse !w-[83px] !h-[38px]' /> 
                </div>               
            </div>
        </div>
    )
}

/**
 * ## CardPostSkeleton
 * ---
 * Skeleton for the `CardPost` component.
 */

export function CardPostSkeleton() {
    return (
        <div className="flex flex-col sm:flex-row w-full items-center gap-4 group transition-all bg-foreground border-0 border-border group-hover/title:!border-white h-fit rounded-sm px-6 py-6">
            <div className="flex w-full bg-transparent h-fit flex-col flex-shrink min-w-0">
                <div className="text-sm z-20 w-fit flex flex-col min-w-0">
                    <div className='flex flex-col min-w-0'>
                        <div className='flex flex-row gap-2 items-center justify-center min-w-0'>
                            <div className='flex flex-col min-w-0'>
                                <div className='bg-border rounded-sm animate-pulse w-[150px] h-[20px] mb-1 min-w-0' /> 
                                <div className="flex gap-1 min-w-0">
                                    <div className='bg-border rounded-sm animate-pulse w-[60px] h-[20px] min-w-0' /> 
                                    <div className='bg-border rounded-sm animate-pulse w-[150px] h-[20px] min-w-0' /> 
                                </div>                                                                                             
                            </div>
                        </div>
                    </div>
                </div>
                    
                <div className='bg-border rounded-sm animate-pulse w-[280px] h-[28px] mt-1 min-w-0' /> 

                <div className='flex flex-row mt-4 justify-between min-w-0'>
                    <div className='flex flex-row gap-2 min-w-0'>
                        <div className='bg-border rounded-sm animate-pulse w-[105px] h-[38px] min-w-0' /> 
                        <div className='bg-border rounded-sm animate-pulse w-[123px] h-[38px] min-w-0' /> 
                        <div className='bg-border rounded-sm animate-pulse w-[85px] h-[38px] min-w-0' /> 
                    </div>
                    <div className='bg-border rounded-sm animate-pulse w-[38px] h-[38px] min-w-0' />                         
                </div>                
            </div>
        </div>
    );
}