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

export const commonPlayers = [
    { name: 'Anotand', profileIds: [8432378, 11443994, 15908244] },
    { name: 'Baltune', profileIds: [4583101, 11635995, 17669489] },
    { name: 'Beastyqt', profileIds: [1270139, 11962132, 17316252, 8139502] },
    { name: 'Big bees', profileIds: [3142875] },
    { name: 'Blade55555', profileIds: [193771] },
    { name: 'benghisKhan', profileIds: [7273067] },
    { name: 'Divine', profileIds: [585764, 9030482] },
    { name: 'Demu', profileIds: [6943917, 9087979] },
    { name: 'e.sorcerer', profileIds: [199837, 4067151, 5924659, 2138271] },
    { name: 'Faye', profileIds: [1036727] },
    { name: 'Fitzbro', profileIds: [16449840, 707064] },
    { name: 'wntdSAS', profileIds: [2347873] },
    { name: 'GiveUAnxiety', profileIds: [3553830] },
    { name: 'Hatsimale', profileIds: [6989434, 11655695, 11621759, 11676991, 11770944, 5184393, 8507263] },
    { name: 'Kasva', profileIds: [1224481, 2759481, 10322245] },
    { name: 'Kiljardi', profileIds: [3813060, 8840075] },
    { name: 'Lash', profileIds: [3877183, 9860780] },
    { name: 'LoueMT', profileIds: [8354416] },
    { name: 'Matiz', profileIds: [3671968] },
    { name: 'MrMonday', profileIds: [3145086, 17144484] },
    { name: 'Myriad', profileIds: [769187, 11915979] },
    { name: 'Msn.dk', profileIds: [7614140] },
    { name: 'Peppino piggg', profileIds: [6552004] },
    { name: 'Praetorian', profileIds: [7188408] },
    { name: 'Puppypaw', profileIds: [8446710, 8783044, 3592906] },
    { name: 'Renion', profileIds: [5065284, 10939549, 11548504, 9287427, 10411496, 10832054, 17971186, 19563347, 15418341] },
    { name: 'Rob the viking', profileIds: [6914972] },
    { name: 'Sky-Fox', profileIds: [9189043, 10477434] },
    { name: 'Snoopa', profileIds: [3587904, 4492346] },
    { name: 'Steel Commander', profileIds: [8989957, 17256881] },
    { name: 'Steff', profileIds: [3549470] },
    { name: 'Stilicho', profileIds: [16400848, 1289057, 8770503] },
    { name: 'Valdemar', profileIds: [2942077, 10599576] },
    { name: 'Corvinus', profileIds: [3599155, 6924135] },
    { name: 'MarineLord', profileIds: [1102458, 7410194] },
    { name: 'Elyona', profileIds: [15218890] },
    { name: 'Wam01', profileIds: [8442107, 9375030, 10390647, 11873317, 3637474] },
    { name: 'Dyuksui', profileIds: [310568, 15201971] },
    { name: 'Leenock', profileIds: [7591377, 7235947, 9791747, 15535949] },
    { name: 'Numudan', profileIds: [9298419] },
    { name: 'TheViper', profileIds: [12419632] },
    { name: '3DBee', profileIds: [6946065, 9950482, 10415109] },
    { name: 'Core', profileIds: [7090781, 10089637, 12215259] },
    { name: 'Crackedy', profileIds: [230361, 11542281, 9549670] },
];