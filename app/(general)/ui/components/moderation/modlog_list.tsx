"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import { ModerationLog } from "@prisma/client";
import { useEffect, useState } from "react";

import dayjs from "@/app/(general)/lib/dayjs";

export function ModlogList({ communityId }: { communityId: string }) {

    const [modlogs, setModlogs] = useState<ModerationLog>();
    const [totalModlogs, setTotalModlogs] = useState<number>(0);

    const [page, setPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [pageForwardAllowed, setPageForwardAllowed] = useState<boolean>(true);

    const [loading, setLoading] = useState(true);

    try {
        useEffect(() => {
            fetch("/api/community/modlogs", {
                method: "POST",
                body: JSON.stringify({ "page": `${page}`, "communityID": `${communityId}` })
            })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setModlogs(data.modlogs);
                setTotalModlogs(data.modlogCount);
                setTotalPages(Math.ceil(totalPages / 10))
                setLoading(false);
            });
        }, [communityId, page, totalPages])        
    } catch ( error ) {
        return (
            <div className='flex flex-col items-center justify-center w-full relative group transition-all bg-card h-[174px] rounded-lg px-5 py-5'>
                <p className='text-center text-gray-300 font-medium antialiased w-full'>Sorry, an error occurred.</p>
                <div className='flex gap-4 w-full items-center justify-center mt-4'>
                    <button className='navlink' onClick={() => window.location.reload()} type='button'>Reload</button>
                </div>
            </div>            
        );
    }

    function nextPage() {
        setPageForwardAllowed(false);
        if (page < totalPages - 1) {
            setPage(page + 1);
            setPageForwardAllowed(true);
        }
    }
    function lastPage() {
        if ( page > 0 ) {
            setPage(page - 1);
            setPageForwardAllowed(true);
        }
    }

    if ( loading ) {
        return (
            <div className='w-[800px] h-[363px] animate-pulse bg-border rounded' />
        );
    }

    if ( totalModlogs <= 0 ) {
        return <p className='text-center text-gray-300 font-medium antialiased w-full'>Looks like there&apos;s no moderation logs here.</p>
    }

    return (
        <div className='flex flex-col max-w-full overflow-x-scroll'>
            <table>
                <thead>
                    <tr>
                        <th>Admin ID</th>
                        <th>Action</th>
                        <th>Subject Type</th>
                        <th>Subject ID</th>
                        <th>Time</th>
                    </tr>                    
                </thead>
                <tbody>
                    {Array.isArray(modlogs) && modlogs.map((modlog: ModerationLog) => {
                        return (
                            <tr key={modlog.id}>
                                <td>{modlog.adminId}</td>
                                <td>{modlog.action}</td>
                                <td>{modlog.subjectType}</td>
                                <td>{modlog.subjectId}</td>
                                <td>{dayjs(modlog.createdAt).fromNow()}</td>
                            </tr>
                        );
                    })}                    
                </tbody>
            </table>
            <div className='flex gap-4 items-center mt-5'>
                <button onClick={() => lastPage()} className='navlink !px-2' disabled={ page === 0 ? true : false } aria-label='Last Page'><ChevronLeftIcon className='w-5 h-5' /></button>  
                <p className='subtitle h-fit'>{ page + 1 } of { totalPages || "1" }</p>
                <button onClick={() => nextPage()} className='navlink !px-2' disabled={ !pageForwardAllowed || page === totalPages - 1 } aria-label='Next Page'><ChevronRightIcon className='w-5 h-5' /></button>            
            </div>
        </div>
    );
}