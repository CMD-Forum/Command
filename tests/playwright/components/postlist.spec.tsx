import { expect, test } from '@playwright/experimental-ct-react';
import PostList from '../../../src/components/posts/post_list';

const mockPostsResponse = {
    postCount: 12,
    posts: [
        {
            id: '1',
            createdAt: '2023-01-01T12:00:00Z',
            updatedAt: '2023-01-01T12:00:00Z',
            title: 'First Post',
            content: 'This is the first post',
            imageurl: null,
            imageblur: null,
            imagealt: null,
            public: true,
            href: null,
            deletedByAdmin: false,
            deletedByAuthor: false,
            community: {
                id: 'general',
                name: 'general',
                image: null,
                description: "The community for anything and everything.",
                createdAt: new Date(),
            },
            author: {
                id: 'author1',
                username: 'Author1',
                createdAt: new Date(),
                image: null,
                description: "Hello, I'm Author1!",
            }
        },
        {
            id: '2',
            createdAt: '2024-07-01T16:34:21Z',
            updatedAt: '2024-07-01T16:34:21Z',
            title: 'How is everyone here today?',
            content: 'All well, I hope.',
            imageurl: null,
            imageblur: null,
            imagealt: null,
            public: true,
            href: null,
            deletedByAdmin: false,
            deletedByAuthor: false,
            community: {
                id: 'askusrcom',
                name: 'askusrcom',
                image: "/images/uploaded/test.png",
                description: "Ask the users of usrcom anything",
                createdAt: new Date(),
            },
            author: {
                id: 'odduser!@#\"name',
                username: 'odduser!@#\"name', // To test if the UI handles odd characters
                createdAt: new Date("2022-03-01T11:54:56Z"),
                image: "/images/uploaded/Icon-512x512.png",
                description: null,
            }
        },
        {
            id: '3',
            createdAt: '2023-02-01T17:12:34Z',
            updatedAt: '2023-02-01T17:12:34Z',
            title: 'Generic news article title',
            content: 'Bla bla bla, bla bla, bla bla bla bla this is a very concerning development, bla bla bla, I hope this gets resolved soon.',
            imageurl: null,
            imageblur: null,
            imagealt: null,
            public: true,
            href: 'https://example.com', // To test if the URL post type works
            deletedByAdmin: false,
            deletedByAuthor: false,
            community: {
                id: 'news',
                name: 'news',
                image: null,
                description: null,
                createdAt: new Date("2020-01-01T11:11:11Z"),
            },
            author: {
                id: 'official_news_account',
                username: 'offical_news_account',
                createdAt: new Date("2019-12-01T23:45:39Z"),
                image: "/brokenimagelink", // To test if the fallback avatar image works
                description: "The official news account of {news_site}.",
            }
        },
        {
            id: '4',
            createdAt: '2018-05-01T12:56:23Z',
            updatedAt: '2018-05-01T12:56:23Z',
            title: 'Look at this amazing picture that I took!',
            content: null,
            imageurl: "https://placehold.co/1000x500", // To test if image posts work
            imageblur: null,
            imagealt: null,
            public: true,
            href: null,
            deletedByAdmin: false,
            deletedByAuthor: false,
            community: {
                id: 'pictures',
                name: 'pictures',
                image: null,
                description: "The premier destination for pictures!",
                createdAt: new Date("2019-02-02T22:22:22Z"),
            },
            author: {
                id: 'user4',
                username: 'user4',
                createdAt: new Date("2019-12-01T21:23:45Z"),
                image: "/images/uploaded/Icon-512x512.png",
                description: null,
            }
        },
        {
            id: '5',
            createdAt: '2000-05-01T12:56:23Z', // To see if the UI can handle old dates
            updatedAt: '2000-05-01T12:56:23Z',
            title: 'I wonder how I managed to post this 25 years ago...',
            content: "Amazing, isn't it?",
            imageurl: null,
            imageblur: null,
            imagealt: null,
            public: true,
            href: null,
            deletedByAdmin: false,
            deletedByAuthor: false,
            community: {
                id: 'all',
                name: 'all',
                image: "/images/uploaded/Icon-512x512.png",
                description: "c/all, the original community",
                createdAt: new Date("1970-01-01T00:00:00Z"), // More date testing
            },
            author: {
                id: 'user5',
                username: 'user5',
                createdAt: new Date("1900-12-12T00:00:00Z"), // More date testing
                image: "/images/uploaded/Icon-512x512.png",
                description: "I'm really old!",
            }
        },
        {
            id: '6',
            createdAt: '2025-05-01T12:56:23Z',
            updatedAt: '2025-05-01T12:56:23Z',
            title: 'Test post',
            content: "# Markdown test \n\n ## Header 2 \n\n This is a paragraph.",
            imageurl: null,
            imageblur: null,
            imagealt: null,
            public: true,
            href: null,
            deletedByAdmin: false,
            deletedByAuthor: false,
            community: {
                id: 'all',
                name: 'all',
                image: "/images/uploaded/Icon-512x512.png",
                description: "c/all, the original community",
                createdAt: new Date("1970-01-01T00:00:00Z"),
            },
            author: {
                id: 'user___6',
                username: 'user___6',
                createdAt: new Date("1999-12-12T00:00:00Z"),
                image: "/images/uploaded/Icon-512x512.png",
                description: "I'm also old, but not as much as u/user5",
            }
        },

        // Every post past this point is a copy of the previous ones. I was't writing all that by hand.

        {
            id: '7',
            createdAt: '2023-01-01T12:00:00Z',
            updatedAt: '2023-01-01T12:00:00Z',
            title: 'First Post',
            content: 'This is the first post',
            imageurl: null,
            imageblur: null,
            imagealt: null,
            public: true,
            href: null,
            deletedByAdmin: false,
            deletedByAuthor: false,
            community: {
                id: 'general',
                name: 'general',
                image: null,
                description: "The community for anything and everything.",
                createdAt: new Date(),
            },
            author: {
                id: 'author1',
                username: 'Author1',
                createdAt: new Date(),
                image: null,
                description: "Hello, I'm Author1!",
            }
        },
        {
            id: '8',
            createdAt: '2024-07-01T16:34:21Z',
            updatedAt: '2024-07-01T16:34:21Z',
            title: 'How is everyone here today?',
            content: 'All well, I hope.',
            imageurl: null,
            imageblur: null,
            imagealt: null,
            public: true,
            href: null,
            deletedByAdmin: false,
            deletedByAuthor: false,
            community: {
                id: 'askusrcom',
                name: 'askusrcom',
                image: "/images/uploaded/test.png",
                description: "Ask the users of usrcom anything",
                createdAt: new Date(),
            },
            author: {
                id: 'odduser!@#\"name',
                username: 'odduser!@#\"name', // To test if the UI handles odd characters
                createdAt: new Date("2022-03-01T11:54:56Z"),
                image: "/images/uploaded/Icon-512x512.png",
                description: null,
            }
        },
        {
            id: '9',
            createdAt: '2023-02-01T17:12:34Z',
            updatedAt: '2023-02-01T17:12:34Z',
            title: 'Generic news article title',
            content: 'Bla bla bla, bla bla, bla bla bla bla this is a very concerning development, bla bla bla, I hope this gets resolved soon.',
            imageurl: null,
            imageblur: null,
            imagealt: null,
            public: true,
            href: 'https://example.com', // To test if the URL post type works
            deletedByAdmin: false,
            deletedByAuthor: false,
            community: {
                id: 'news',
                name: 'news',
                image: null,
                description: null,
                createdAt: new Date("2020-01-01T11:11:11Z"),
            },
            author: {
                id: 'official_news_account',
                username: 'offical_news_account',
                createdAt: new Date("2019-12-01T23:45:39Z"),
                image: "/brokenimagelink", // To test if the fallback avatar image works
                description: "The official news account of {news_site}.",
            }
        },
        {
            id: '10',
            createdAt: '2018-05-01T12:56:23Z',
            updatedAt: '2018-05-01T12:56:23Z',
            title: 'Look at this amazing picture that I took!',
            content: null,
            imageurl: "https://placehold.co/1000x500", // To test if image posts work
            imageblur: null,
            imagealt: null,
            public: true,
            href: null,
            deletedByAdmin: false,
            deletedByAuthor: false,
            community: {
                id: 'pictures',
                name: 'pictures',
                image: null,
                description: "The premier destination for pictures!",
                createdAt: new Date("2019-02-02T22:22:22Z"),
            },
            author: {
                id: 'user4',
                username: 'user4',
                createdAt: new Date("2019-12-01T21:23:45Z"),
                image: "/images/uploaded/Icon-512x512.png",
                description: null,
            }
        },
        {
            id: '11',
            createdAt: '2000-05-01T12:56:23Z', // To see if the UI can handle old dates
            updatedAt: '2000-05-01T12:56:23Z',
            title: 'I wonder how I managed to post this 25 years ago...',
            content: "Amazing, isn't it?",
            imageurl: null,
            imageblur: null,
            imagealt: null,
            public: true,
            href: null,
            deletedByAdmin: false,
            deletedByAuthor: false,
            community: {
                id: 'all',
                name: 'all',
                image: "/images/uploaded/Icon-512x512.png",
                description: "c/all, the original community",
                createdAt: new Date("1970-01-01T00:00:00Z"), // More date testing
            },
            author: {
                id: 'user5',
                username: 'user5',
                createdAt: new Date("1900-12-12T00:00:00Z"), // More date testing
                image: "/images/uploaded/Icon-512x512.png",
                description: "I'm really old!",
            }
        },
        {
            id: '12',
            createdAt: '2025-05-01T12:56:23Z',
            updatedAt: '2025-05-01T12:56:23Z',
            title: 'Test post',
            content: "# Markdown test \n\n ## Header 2 \n\n This is a paragraph.",
            imageurl: null,
            imageblur: null,
            imagealt: null,
            public: true,
            href: null,
            deletedByAdmin: false,
            deletedByAuthor: false,
            community: {
                id: 'all',
                name: 'all',
                image: "/images/uploaded/Icon-512x512.png",
                description: "c/all, the original community",
                createdAt: new Date("1970-01-01T00:00:00Z"),
            },
            author: {
                id: 'user___6',
                username: 'user___6',
                createdAt: new Date("1999-12-12T00:00:00Z"),
                image: "/images/uploaded/Icon-512x512.png",
                description: "I'm also old, but not as much as u/user5",
            }
        },
    ],
};

test('loads and displays posts, allows pagination and sorting', async ({ mount, page }) => {
    // Intercept the fetch call triggered by PostList and respond with mock data
    await page.route('**/api/posts/getAll*', route => {
        route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockPostsResponse),
        });
    });

    // Mount your component, passing required props
    const component = await mount(<PostList url="/api/posts/getAll" />);

    // Assert that the post title appears
    await expect(component.locator('text=First Post')).toBeVisible();

    // Find and interact with sort select, change to "New"
    const sortSelect = component.locator('role=combobox');
    await sortSelect.click();

    const newSortOption = component.locator('role=option', { hasText: 'New' });
    await newSortOption.click();

    // After sorting change, you could check fetch was called again or UI updates

    // Pagination example: click next page
    const nextPageButton = component.locator('button[aria-label="Next"]');
    await nextPageButton.click();

    // Check UI reflects page change (e.g., page number active)
    await expect(component.locator('button[aria-current="true"]')).toHaveText('2');

    // Test toggling the view mode (FullCard/ThumbnailCard)
    const thumbnailToggle = component.locator('role=button', { hasText: '' }); // refine selector for toggle group item with ThumbnailCard icon or aria-label
    await thumbnailToggle.click();

    // Add assertions related to cookie or localStorage if needed

});