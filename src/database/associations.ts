import { Player } from "../modules/player/player.model";
import { Team } from "../modules/team/team.model";

Team.hasMany(Player, {
    foreignKey: "team_id",
    as: "playerId",
});

Player.belongsTo(Team, {
    foreignKey: "team_id",
    as: "teamId",
});
