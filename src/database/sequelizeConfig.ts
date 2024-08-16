import "dotenv/config";

export default {
    development: {
        username: process.env.DB_USER || "",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "",
        host: process.env.DB_HOST || "",
        dialect: "mysql",
        seederStorage: "json",
        seederStoragePath: "sequelizeData.json",
        seederStorageTableName: "seeder_data",
        define: {
            freezeTableName: true,
            timestamps: true,
            underscored: true,
        },
    },
    production: {
        username: process.env.PROD_DB_USER || "",
        password: process.env.PROD_DB_PASSWORD || "",
        database: process.env.PROD_DB_NAME || "",
        host: process.env.PROD_DB_HOST || "",
        dialect: "mysql",
        seederStorage: "json",
        seederStoragePath: "sequelizeData.json",
        seederStorageTableName: "seeder_data",
        define: {
            freezeTableName: true,
            timestamps: true,
            underscored: true,
        },
    },
};
