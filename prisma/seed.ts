import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

    const communities = [
		{ 
			id: "1", 
			name: "general", 
			image: "/TextPostFallback.png", 
			public: true, 
			description: "The community for anything and everything.",
			sidebar_content: "# Welcome to c/general!\nAs the description says, this is the community for anything and everything. Feel free to post about whatever you want, as long as it follows the rules. Enjoy your stay!",
		},
		{ 
			id: "2", 
			name: "meta", 
			image: "/TextPostFallback.png", 
			public: true, 
			description: "The community for discussing the community.",
			sidebar_content: "# Welcome to c/meta!\nAs the description says, this is the community for discussing the community, aka Command.",
		},
		{ 
			id: "3", 
			name: "television", 
			image: "/TextPostFallback.png", 
			public: true, 
			description: "The community for discussing television shows.",
			sidebar_content: "# c/television!\nAnything related to television shows. No movies.",
		},
		{ 
			id: "4", 
			name: "movies", 
			image: "/TextPostFallback.png", 
			public: true, 
			description: "The community for discussing movies.",
			sidebar_content: "# c/movies!\nAnything related to movies. No television shows.",
		},
		{ 
			id: "5", 
			name: "music", 
			image: "/TextPostFallback.png", 
			public: true, 
			description: "The community for discussing music.",
			sidebar_content: "# Welcome toooo c/music!\nFrom rock and roll to opera, this is the place to discuss music.",
		},
		{ 
			id: "6", 
			name: "history", 
			image: "/TextPostFallback.png",
			public: true, 
			description: "The community for discussing history.",
			sidebar_content: "History of the world. Fictional posts on Fridays only, please.",
		},
    ];

    const users = [
		{ id: "1", email: "johndoe@example.com", username: "username1", password_hash: "" },
		{ id: "2", email: "janedoe@example.com", username: "username2", password_hash: "" },
		{ id: "3", email: "user@testing.com", username: "Testing521", password_hash: "" },
		{ id: "4", email: "hello@howareyou.com", username: "HowAreYou", password_hash: "" },
    ];

    const posts = [
		{ communityId: "3", title: "So, what did you think of last nights episode?", content: "I think it was great, how about you?", public: true, authorId: "2", imageurl: null, imagealt: null, createdAt: new Date("5/11/26") },
		{ communityId: "2", title: "Feature suggestion", content: "What if we implement this feature, using the code above?", public: true, authorId: "3", imageurl: "/images/uploaded/code.png", imagealt: "The code in question.", createdAt: new Date("December 1, 2022 06:54:44") },
		{ communityId: "4", title: "I think \"Snakes on a Plane\" was just okay.", content: "# Hah, just kidding. \n It's actually great.", public: true, authorId: "4", imageurl: null, imagealt: null, createdAt: new Date("December 23, 2023 12:32:43") },
		{ communityId: "1", title: "This post is really old.", content: "This is just to test dates.", public: true, authorId: "1", imageurl: null, imagealt: null, createdAt: new Date("December 17, 1995 03:24:00") },
    ];

    const newCommunities = await Promise.all(communities.map(community => prisma.community.create({ data: community })));
    const newUsers = await Promise.all(users.map(user => prisma.user.create({ data: user })));
    const newPosts = await Promise.all(posts.map(post => prisma.post.create({ data: post })));

	const moderators = [
        { communityId: "1", userId: "1" },
		{ communityId: "1", userId: "2" },
        { communityId: "2", userId: "3" },
		{ communityId: "3", userId: "1" },
		{ communityId: "4", userId: "4" },
		{ communityId: "5", userId: "4" },
		{ communityId: "5", userId: "1" },
		{ communityId: "6", userId: "2" },
		{ communityId: "1", userId: "3" },
    ];

    const newModerators = await Promise.all(moderators.map(moderator =>
        prisma.communityModerator.create({
            data: {
                communityID: moderator.communityId,
                userID: moderator.userId,
            }
        })
    ));

    const rules = [
        { communityId: "1", title: "Be respectful to others.", description: "Don't be rude or disrespectful to other users." },
        { communityId: "1", title: "No spamming.", description: "Don't spam the community with low-effort posts or comments." },

		{ communityId: "2", title: "Be respectful.", description: "Do not be disrespectful." },
        { communityId: "2", title: "Do not spam.", description: "Do not spam the community." },
        { communityId: "2", title: "Stay focused on Command.", description: "Don't post off-topic content, only content about Command." },

		{ communityId: "3", title: "Be respectful to others.", description: "Don't be rude or disrespectful to other users." },
        { communityId: "3", title: "No spamming.", description: "Don't spam the community with low-effort posts or comments." },
        { communityId: "3", title: "Keep discussions about television.", description: "Don't post off-topic content." },

		{ communityId: "4", title: "Be respectful to others.", description: "Don't be rude or disrespectful to other users." },
        { communityId: "4", title: "No spamming.", description: "Don't spam the community with low-effort posts or comments." },
        { communityId: "4", title: "Keep discussions about movies.", description: "Don't post off-topic content." },

		{ communityId: "5", title: "Be respectful to others.", description: "Don't be rude or disrespectful to other users." },
        { communityId: "5", title: "No spamming.", description: "Don't spam the community with low-effort posts or comments." },
        { communityId: "5", title: "Keep discussions about the music.", description: "Don't post off-topic content." },

		{ communityId: "6", title: "Be respectful to others.", description: "Don't be rude or disrespectful to other users." },
        { communityId: "6", title: "No spamming.", description: "Don't spam the community with low-effort posts or comments." },
        { communityId: "6", title: "Keep discussions about the community.", description: "Don't post off-topic content." },
		{ communityId: "6", title: "Fictional posts on Fridays only.", description: "History is usually for historically accurate conversation." },
    ];
	
    const newRules = await Promise.all(rules.map(rule =>
        prisma.communityRule.create({
            data: {
                communityID: rule.communityId,
                title: rule.title,
				description: rule.description,
            }
        })
    ));

    console.log(newCommunities, newUsers, newPosts, newModerators, newRules);
}

main()

    .then(async () => {
      	await prisma.$disconnect()
    })

    .catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
    })
