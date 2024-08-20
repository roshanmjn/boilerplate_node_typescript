"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("player", {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            nickname: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            team_id: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "team",
                    key: "id",
                },
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            },
            first_name: {
                type: Sequelize.DataTypes.STRING(15),
                allowNull: false,
            },
            middle_name: {
                type: Sequelize.DataTypes.STRING(15),
                allowNull: true,
            },
            last_name: {
                type: Sequelize.DataTypes.STRING(15),
                allowNull: false,
            },
            squad_number: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: true,
            },
            squad_role: {
                type: Sequelize.DataTypes.STRING,
                allowNull: true,
            },
            email: {
                type: Sequelize.DataTypes.STRING(60),
                allowNull: true,
            },
            age: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: true,
            },
            height: {
                type: Sequelize.DataTypes.DECIMAL(4, 2),
                allowNull: true,
            },
            profile_picture: {
                type: Sequelize.DataTypes.STRING,
                allowNull: true,
                defaultValue: "https://robohash.org/3L2.png?set=set4",
            },
            active: {
                type: Sequelize.DataTypes.BOOLEAN,
                defaultValue: true,
            },
            created_at: {
                type: Sequelize.DataTypes.DATE,
                defaultValue: new Date(),
            },
            updated_at: {
                type: Sequelize.DataTypes.DATE,
                defaultValue: new Date(),
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("player");
    },
};
