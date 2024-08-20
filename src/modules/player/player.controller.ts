import catchAsync from "../../utils/catchAsync";
import { Player } from "./player.model";
import { CreatePlayerDto, PlayerDto, UpdatePlayerDto } from "./player.dto";
import { HttpException } from "../../middlewares/errors";
import { responseHandler } from "../../utils/responseHandler";
import httpStatus from "http-status";
import * as playerService from "./player.service";

/**
 * @swagger
 * /api/v1/player:
 *  get:
 *   tags:
 *    - Player
 *   summary: Get all players
 *   responses:
 *   200:
 *       description: OK
 *   500:
 *      description: Internal Server Error
 */
export const selectAllPlayers = catchAsync(async (req, res) => {
    const players = await Player.findAll();
    return res.status(200).json(players);
});

/**
 * @swagger
 * /api/v1/player/{id}:
 *   get:
 *     tags:
 *       - Player
 *     summary: Get particular player by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           description: Player ID
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
export const selectOnePlayer = catchAsync(async (req, res) => {
    const player_id = req.params.id;
    const result = await Player.findOne({ where: { id: player_id } });
    return res.status(httpStatus.OK).json(result);
});

/**
 * @swagger
 * /api/v1/player:
 *   post:
 *     tags:
 *       - Player
 *     summary: Create a player
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - nickname
 *               - email
 *               - team_id
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: John
 *                 description: First name of the player
 *               middle_name:
 *                 type: string
 *                 example: Fking
 *                 description: Middle name of the player (optional)
 *               last_name:
 *                 type: string
 *                 example: Doe
 *                 description: Last name of the player
 *               email:
 *                 type: string
 *                 example: johndoe@mail.com
 *                 description: Email address of the player
 *               nickname:
 *                 type: string
 *                 example: jd69
 *                 description: Nickname of the player
 *               team_id:
 *                 type: integer
 *                 example: 1
 *                 description: Team ID that the player belongs to
 *               squad_number:
 *                 type: integer
 *                 example: 10
 *                 description: Squad number of the player, e.g., 10, 11, 12
 *               squad_role:
 *                 type: string
 *                 example: Forward
 *                 description: Role of the player in the team, e.g., Forward, Midfielder, Defender
 *               age:
 *                 type: integer
 *                 example: 36
 *                 description: Age of the player
 *               height:
 *                 type: number
 *                 format: float
 *                 example: 5.5
 *                 description: Height of the player in feet
 *               profile_picture:
 *                 type: string
 *                 example: 'picture.jpeg'
 *                 description: Profile picture filename
 *     responses:
 *       201:
 *         description: Created successfully
 *       409:
 *         description: Conflict (e.g., duplicate entry)
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
export const createPlayer = catchAsync(async (req, res) => {
    const data = req.body as CreatePlayerDto;
    const result = await playerService.createPlayer(data);
    return res.status(httpStatus.CREATED).json(responseHandler(result));
});

/**
 * @swagger
 * /api/v1/player/{id}:
 *   put:
 *     tags:
 *       - Player
 *     summary: Update a player
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           description: Player ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: John2
 *                 description: First name of the player
 *               middle_name:
 *                 type: string
 *                 example: Fking2
 *                 description: Middle name of the player (optional)
 *               last_name:
 *                 type: string
 *                 example: Doe2
 *                 description: Last name of the player
 *               email:
 *                 type: string
 *                 example: john2doe2@mail.com
 *                 description: Email address of the player
 *               nickname:
 *                 type: string
 *                 example: jd692
 *                 description: Nickname of the player
 *               team_id:
 *                 type: integer
 *                 example: 1
 *                 description: Team ID that the player belongs to
 *               squad_number:
 *                 type: integer
 *                 example: 11
 *                 description: Squad number of the player, e.g., 10, 11, 12
 *               squad_role:
 *                 type: string
 *                 example: Left Wing
 *                 description: Role of the player in the team, e.g., Forward, Midfielder, Defender
 *               age:
 *                 type: integer
 *                 example: 37
 *                 description: Age of the player
 *               height:
 *                 type: number
 *                 format: float
 *                 example: 5.7
 *                 description: Height of the player in feet
 *               profile_picture:
 *                 type: string
 *                 example: picture2.jpeg
 *                 description: Profile picture filename
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */

export const updatePlayer = catchAsync(async (req, res) => {
    const data = req.body as UpdatePlayerDto;
    const id = req.params.id as unknown as number;
    const result = await playerService.updatePlayer(data, id);
    return res.status(httpStatus.OK).json(responseHandler(result));
});

/**
 * @swagger
 * /api/v1/player/{id}:
 *   delete:
 *     tags:
 *       - Player
 *     summary: Delete player
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           description: Player ID
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
export const deletePlayer = catchAsync(async (req, res) => {
    const id = req.params.id as unknown as number;
    console.log(id);
    await playerService.deletePlayer(id);
    return res.status(httpStatus.NO_CONTENT).send();
});

/**
 * @swagger
 * /api/v1/player/team/{team_id}:
 *   get:
 *     tags:
 *       - Player
 *     summary: Select players by team
 *     parameters:
 *       - in: path
 *         name: team_id
 *         required: true
 *         schema:
 *           type: integer
 *           description: Team ID
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
export const selectPlayersByTeam = catchAsync(async (req, res) => {
    const team_id = req.params.team_id as unknown as number;
    const result = await playerService.selectPlayersByTeam(team_id);
    return res.status(httpStatus.OK).json(result);
});
