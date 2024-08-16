import { RowDataPacket } from "mysql2";

export type UserData = {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirm_password: string;
    image: string;
    is_admin: boolean;
};

export interface LoginQueryData extends RowDataPacket {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    image: string;
    is_admin: boolean;
    is_super_admin: boolean;
    status: boolean;
    groups: string;
}

export type DiscordAuthResponse = {
    id?: number;
    first_name?: string;
    last_name?: string;
    email?: string;
    image?: string | null;
    token?: string;
    refreshToken?: string;
};
