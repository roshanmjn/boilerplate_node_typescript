import { sequelize } from "../../database/connection";
import { DataTypes } from "sequelize";

export const Player = sequelize.define("player", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nickname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    team_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "team",
            key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    },
    first_name: {
        type: DataTypes.STRING(15),
        allowNull: false,
    },
    middle_name: {
        type: DataTypes.STRING(15),
        allowNull: true,
    },
    last_name: {
        type: DataTypes.STRING(15),
        allowNull: false,
    },
    squad_number: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    squad_role: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING(60),
        allowNull: true,
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    height: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: true,
    },
    profile_picture: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "https://robohash.org/3L2.png?set=set4",
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
    },
});
