export function ProfileMainSkeleton() {
    return (
        <div className="flex-row gap-2 rounded-sm w-full bg-transparent">
            <div className="flex-col">
                <div className="flex flex-row gap-3 items-center">
                    <div className="bg-border rounded-sm animate-pulse !w-[56px] !h-[56px]" /> 
                    <div className="flex flex-col gap-1">
                        <div className="bg-border rounded-sm animate-pulse !w-[200px] !h-[38px]" /> 
                        <div className="bg-border rounded-sm animate-pulse !w-[349px] !h-[20px]" /> 
                    </div>
                </div>

                <div className="flex flex-row gap-3 items-center mt-2">
                    <div className="bg-border rounded-sm animate-pulse !w-[125px] !h-[20px]" />    
                </div>
            </div>
        </div>  
    );
}