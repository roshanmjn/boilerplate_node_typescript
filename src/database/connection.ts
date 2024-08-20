import { Sequelize, Dialect, QueryTypes } from "sequelize";
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

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: "postgres",
    // logging: (...msg) => console.log(msg),
    logging: false,
    define: {
        freezeTableName: true,
        underscored: true,
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
    },
});

type PingData = {
    solution: number;
};
async function pingDB() {
    try {
        const [rows]: PingData[] = await sequelize.query("SELECT 1 + 1 AS solution", {
            type: QueryTypes.SELECT,
        });
        console.log("The solution is: ", rows?.solution);
    } catch (error) {
        throw error;
    }
}

pingDB();

setInterval(() => {
    pingDB();
}, 40000);

export { sequelize };
