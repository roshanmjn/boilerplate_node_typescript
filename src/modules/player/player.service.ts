import { Player } from "./player.model";
import { CreatePlayerDto, UpdatePlayerDto } from "./player.dto";
import { HttpException } from "../../middlewares/errors";
import { Logger } from "../../utils/Logger";

export const selectAllPlayers = async () => {
    try {
        return await Player.findAll();
    } catch (err: any) {
        console.error(`selectAllPlayers: ${err.message}`);
        Logger.error("selectAllPlayers", err.message);
        throw new HttpException(500, "Internal server error");
    }
};

export const selectOnePlayer = async (id: number) => {
    try {
        const result = await Player.findOne({ where: { id } });
        if (!result) {
            throw new HttpException(404, "Player not found");
        }
        return result;
    } catch (err: any) {
        console.error(`selectOnePlayer: ${err.message}`);
        Logger.error("selectOnePlayer", err.message);
        throw new HttpException(500, "Internal server error");
    }
};
export const createPlayer = async (data: CreatePlayerDto) => {
    try {
        const checkPlayer = await Player.findOne({ where: { email: data.email } });
        if (checkPlayer) {
            throw new HttpException(400, "Player already exists!");
        }
        return await Player.create(data);
    } catch (err: any) {
        console.error(`createPlayer: ${err.message}`);
        Logger.error("createPlayer", err.message);
        throw new HttpException(500, "Internal server error");
    }
};

export const updatePlayer = async (data: UpdatePlayerDto, id: number) => {
    try {
        const player = await Player.findOne({ where: { id } });
        if (!player) {
            throw new HttpException(404, "Player not found");
        }
        await Player.update(data, { where: { id } });
        return await Player.findOne({ where: { id } });
    } catch (err: any) {
        if (err instanceof HttpException) {
            throw err;
        } else {
            throw new HttpException(500, "Internal server error");
        }
    }
};

export const deletePlayer = async (id: number) => {
    try {
        const player = await Player.findOne({ where: { id } });

        if (!player) {
            throw new HttpException(404, "Player not found");
        }
        const result = await Player.destroy({ where: { id } });
    } catch (err: any) {
        Logger.error("deletePlayer", err.message);

        if (err instanceof HttpException) {
            throw err;
        } else {
            throw new HttpException(500, "Internal server error");
        }
    }
};

export const selectPlayersByTeam = async (team_id: number) => {
    try {
        return await Player.findAll({ where: { team_id } });
    } catch (err: any) {
        console.error(`selectPlayersByTeam: ${err.message}`);
        Logger.error("selectPlayersByTeam", err.message);
        throw new HttpException(500, "Internal server error");
    }
};
