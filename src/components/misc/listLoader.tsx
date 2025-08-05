import Image from "./image";

export default function ListLoader() {
    return (
        <div className='flex w-full items-center justify-center h-[152px] gap-4 relative group transition-all bg-grey-one rounded-sm p-6'>
            <Image src="/LoadingSpinner.svg" alt="Loading..." width={512} height={512} className="w-8 h-8 animate-spin" />
        </div>
    );
}