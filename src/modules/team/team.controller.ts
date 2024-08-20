import catchAsync from "../../utils/catchAsync";
import { Team } from "./team.model";
import { CreateTeamDto } from "./team.dto";
import { HttpException } from "../../middlewares/errors";

export const createTeam = catchAsync(async (req, res) => {
    const data: CreateTeamDto = req.body;
    const checkTeam = await Team.findOne({ where: { name: data.name } });
    if (checkTeam) {
        throw new HttpException(400, "Team already exists!");
    }
    const team = await Team.create(data);
    return res.status(201).json(team);
});
