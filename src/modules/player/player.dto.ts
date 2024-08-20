export type CreatePlayerDto = {
    nickname: string;
    team_id: number;
    first_name: string;
    middle_name?: string;
    last_name: string;
    squad_number?: number;
    squad_role?: string;
    email: string;
    age?: number;
    height?: number;
    profile_picture?: string;
};

export type UpdatePlayerDto = {
    nickname?: string;
    team_name?: string;
    team_id?: number;
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    email?: string;
    profile_picture?: string;
};

export type PlayerDto = {
    id: number;
    nickname: string;
    team_id: number;
    first_name: string;
    middle_name: string;
    last_name: string;
    squad_number: number;
    squad_role: string;
    email: string;
    age: number;
    height: number;
    profile_picture: string;
    active: boolean;
    created_at: Date;
    updated_at: Date;
};
