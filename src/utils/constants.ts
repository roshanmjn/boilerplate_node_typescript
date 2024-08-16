export type TableNameId = Record<string, number>;

export type MethodNameId = Record<string, number>;

export const constant_table_name_id: TableNameId = {
    skip_role_check: 69,
    tournaments: 1,
    rounds: 2,
    matches: 3,
    teams: 4,
    players: 5,
    live_scores: 6,
};

export const constant_method_name_id: MethodNameId = {
    post: 1,
    put: 2,
    delete: 3,
    get: 4,
};
