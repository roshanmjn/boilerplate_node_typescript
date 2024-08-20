import { Player } from "../modules/player/player.model";
import { Team } from "../modules/team/team.model";

export const syncModels = async (options: Record<string, any>) => {
    const opt = { ...options };
    await Player.sync(options);
    await Team.sync(options);
};
