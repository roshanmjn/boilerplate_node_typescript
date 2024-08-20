import { sequelize } from "../../database/connection";
import { DataTypes } from "sequelize";

export const Team = sequelize.define("team", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    alias: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    team_picture: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "https://robohash.org/3L2.png?set=set4",
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    county_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});
