export type GameData = {
    total_count: number;
    page: number;
    per_page: number;
    count: number;
    offset: number;
    filters: {
        leaderboard: string | null;
        since: string | null;
        profile_ids: number[];
        opponent_profile_id: string;
        opponent_profile_ids: string[];
    };
    games: {
        game_id: number;
        started_at: string;
        updated_at: string;
        duration: number;
        map: string;
        kind: string;
        leaderboard: string;
        mmr_leaderboard: string;
        season: number;
        server: string;
        patch: number;
        average_rating: number;
        average_rating_deviation: number;
        average_mmr: number;
        average_mmr_deviation: number | null;
        ongoing: boolean;
        just_finished: boolean;
        teams: {
            player: {
                profile_id: number;
                name: string;
                country: string;
                result: string;
                civilization: string;
                civilization_randomized: boolean;
                rating: number;
                rating_diff: number;
                mmr: number | null;
                mmr_diff: number | null;
                input_type: string | null;
            };
        }[][];
    }[];
};
