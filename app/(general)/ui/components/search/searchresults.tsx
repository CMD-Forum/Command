import { prisma } from "@/app/(general)/lib/db";

import { PostListCustomData } from "../posts/post_list_custom";

interface SearchResultProps {
    query: string;
    currentPage: number;
    type: string;
}

export default async function SearchResults(search: SearchResultProps) {

    let results

    const formattedQuery = search.query
        .split(' ')
        .map(word => {
            if (word.startsWith('-')) {
                return '!' + word.slice(1);
            } else if (word.startsWith('+')) {
                return word.slice(1);
            } else {
                return word;
            }
        })
        .join(' & ');

    if ( search.type === "post" ) {
        results = await prisma.post.findMany({
            orderBy: {
                _relevance: {
                    fields: ['title', 'content'],
                    search: formattedQuery,
                    sort: 'desc'
                }
            },
            where: {
                OR: [
                    {
                        title: {
                            contains: formattedQuery,
                            mode: "insensitive",
                        },
                    },
                    {
                        content: {
                            contains: formattedQuery,
                            mode: "insensitive",
                        },
                    },
                    {
                        author: {
                            username: {
                                contains: formattedQuery,
                                mode: "insensitive",
                            },
                        },
                    }    
                ]
            },
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
                        // eslint-disable-next-line camelcase
                        display_name: true,
                        image: true,
                        public: true,
                        description: true,
                        admins: {
                            select: {
                                userId: true,
                            },
                        },
                    },
                },
            },
        });
        
        return (
            <div className="flex flex-col">
                {/*{results && results.map((result) => (
                    <div key={result.id}>
                        <CardPost 
                            id={result.id}
                            title={result.title}
                            createdAt={result.createdAt}
                            updatedAt={result.updatedAt}
                            content={result.content}
                            imageurl={result.imageurl}
                            imagealt={result.imagealt}
                            public={result.public}
                            // @ts-ignore
                            community={result.community}
                            author={result.author}
                        />
                        <hr className='mx-4 mt-1/2 mb-1/2' />
                    </div>

                ))}*/}
                {results &&
                    <PostListCustomData data={results} />
                }
                {/*<div className='flex gap-4 items-center px-6 mt-5'>
                    <button onClick={() => lastPage()} className='navlink !px-2' disabled={ page === 0 ? true : false } aria-label='Last Page'><ChevronLeftIcon className='w-5 h-5' /></button>  
                    <p className='subtitle h-fit'>{ page + 1 } of { totalPages || "1" }</p>
                    <button onClick={() => nextPage()} className='navlink !px-2' disabled={ !pageForwardAllowed || page === totalPages - 1 } aria-label='Next Page'><ChevronRightIcon className='w-5 h-5' /></button>            
                </div>*/}
            </div>
        )
    } else if ( search.type === "community" ) {

        results = await prisma.community.findMany({

            orderBy: {

                _relevance: {
                    fields: ['name', 'display_name', 'description'],
                    search: formattedQuery,
                    sort: 'desc'
                }

            },

            where: {

                name: {
                    search: formattedQuery
                }

            },

        });    

    }


}