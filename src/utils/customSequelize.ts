require("dotenv").config();

import { exec } from "child_process";
const fileName = process.argv[1];
console.log(process.env.NODE_ENV);
export default {
    model_generate: () => {
        exec(`npx sequelize-cli model:generate --name ${fileName} --attributes id:number --env ${process.env.NODE_ENV}`, (err, stdout, stderr) => {
            if (err) {
                console.error(`${stdout}`);
            }

            console.log(`${stdout}`);
            console.warn(`${stderr}`);
        });
    },
    migration_generate: () => {
        exec(`npx sequelize migration:create --name ${fileName}-table --env ${process.env.NODE_ENV}`, (err, stdout, stderr) => {
            if (err) {
                console.error(`${stdout}`);
            }

            console.log(`${stdout}`);
            console.warn(`${stderr}`);
        });
    },
    migrate: () => {
        exec(`npx sequelize db:migrate --env ${process.env.NODE_ENV}`, (err, stdout, stderr) => {
            if (err) {
                console.error(`${stdout}`);
            }

            console.log(`${stdout}`);
            console.warn(`${stderr}`);
        });
    },
    migrateRollback: () => {
        exec(`npx sequelize db:migrate:undo --env ${process.env.NODE_ENV}`, (err, stdout, stderr) => {
            if (err) {
                console.error(`${stdout}`);
            }

            console.log(`${stdout}`);
            console.warn(`${stderr}`);
        });
    },
    migrateReset: () => {
        exec(`npx sequelize db:migrate:undo:all --env ${process.env.NODE_ENV}`, (err, stdout, stderr) => {
            if (err) {
                console.error(`${stdout}`);
            }

            console.log(`${stdout}`);
            console.warn(`${stderr}`);
        });
    },
    seed_generate: () => {
        exec(`npx sequelize seed:create --name ${fileName}-table-data --env ${process.env.NODE_ENV}`, (err, stdout, stderr) => {
            if (err) {
                console.error(`${stdout}`);
            }

            console.log(`${stdout}`);
            console.warn(`${stderr}`);
        });
    },
    seed: () => {
        exec(`npx sequelize db:seed:all --env ${process.env.NODE_ENV}`, (err, stdout, stderr) => {
            if (err) {
                console.error(`${stdout}`);
            }

            console.log(`${stdout}`);
            console.warn(`${stderr}`);
        });
    },
    seedRollback: () => {
        exec(`npx sequelize db:seed:undo --env ${process.env.NODE_ENV}`, (err, stdout, stderr) => {
            if (err) {
                console.error(`${stdout}`);
            }

            console.log(`${stdout}`);
            console.warn(`${stderr}`);
        });
    },
    seedReset: () => {
        exec(`npx sequelize db:seed:undo:all --env ${process.env.NODE_ENV}`, (err, stdout, stderr) => {
            if (err) {
                console.error(`${stdout}`);
            }

            console.log(`${stdout}`);
            console.warn(`${stderr}`);
        });
    },
};
