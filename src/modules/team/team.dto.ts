export type CreateTeamDto = {
    name: string;
    nickname: string;
    team_picture: string;
};

export type UpdateTeamDto = {
    name?: string;
    team_picture?: string;
};

export type TeamDto = {
    id: number;
    name: string;
    team_picture: string;
    active: boolean;
    created_at: Date;
    updated_at: Date;
};
