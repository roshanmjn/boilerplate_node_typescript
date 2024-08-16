import { Sequelize, Dialect } from "sequelize";
import * as mysql2 from "mysql2/promise";
import { RowDataPacket } from "mysql2";
import * as sequelizeConfig from "./sequelizeConfig";
import "dotenv/config";

type DBConfig = {
    host: string;
    username: string;
    password: string;
    database: string;
    dialect: string;
    [key: string]: any;
};
let config: DBConfig;

console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === "production") {
    config = sequelizeConfig.default.production;
} else {
    config = sequelizeConfig.default.development;
}

console.log({ db: config.database });
const DB = mysql2.createPool({
    host: config.host,
    user: config.username,
    password: config.password,
    database: config.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

const sequelize = new Sequelize(config.database, config.user, config.password, {
    host: config.host,
    dialect: config.dialect as Dialect,
    logging: false,
    define: {
        freezeTableName: true,
        underscored: true,
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
    },
});

async function pingDB() {
    try {
        const [rows] = await DB.query<RowDataPacket[]>("SELECT 1 + 1 AS solution");
        console.log("The solution is: ", rows[0].solution);
    } catch (error) {
        throw error;
    }
}

pingDB();

setInterval(() => {
    pingDB();
}, 40000);

export { DB, sequelize };
