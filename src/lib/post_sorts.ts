function epochSeconds(date: Date): number {
    return Math.floor(date.getTime() / 1000);
}

// Taken from the old Reddit GitHub repo. Not sure if this is still the system they use, but it'll work.
export function calculateHotScore(ups: number, downs: number, createdAt: Date): number {
    const SCORE = ups - downs;
    const ORDER = SCORE; // This entire function was removed, as it made the scores so close that the first two digits were practically useless.
    const SIGN = SCORE > 0 ? 1 : SCORE < 0 ? -1 : 0;
    const SECONDS = epochSeconds(createdAt) - 1701388800;
    const HOT_SCORE = parseFloat(((SIGN * ORDER * 2) + SECONDS / 45000).toFixed(7));
    return HOT_SCORE;
}

// Again, taken from Reddit.
export function calculateControversialScore(upvotes: number, downvotes: number): number {
    const TOTAL_VOTES = upvotes + downvotes;
    if (TOTAL_VOTES === 0) return 0;

    const Z = 1.96;
    const P = upvotes / TOTAL_VOTES;

    const SCORE = (P + (Z ** 2) / (2 * TOTAL_VOTES) - Z * Math.sqrt((P * (1 - P) + (Z ** 2) / (4 * TOTAL_VOTES)) / TOTAL_VOTES)) / (1 + (Z ** 2) / TOTAL_VOTES);
    return 1 - Math.abs(0.5 - SCORE);
}
