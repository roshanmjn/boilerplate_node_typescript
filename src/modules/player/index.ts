import express from "express";
const router = express.Router();
import { createPlayer, selectAllPlayers, deletePlayer, selectOnePlayer, selectPlayersByTeam, updatePlayer } from "./player.controller";
import { validateParamsSchema, validateSchema } from "../../middlewares/validate";
import { createPlayerDto, playerId, updatePlayerDto } from "./player.validation";

router.use("/", (_, res, next) => {
    console.log("/player");
    next();
});

router.get("/", selectAllPlayers);

router.get("/:id", selectOnePlayer);

router.get("/team/:team_id", selectPlayersByTeam);

router.post("/", validateSchema(createPlayerDto), createPlayer);

router.put("/:id", validateSchema(updatePlayerDto), updatePlayer);

router.delete("/:id", validateParamsSchema(playerId), deletePlayer);

export default router;
