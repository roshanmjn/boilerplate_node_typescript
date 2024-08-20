"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("team", {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            alias: {
                type: Sequelize.DataTypes.STRING,
                allowNull: true,
            },
            team_picture: {
                type: Sequelize.DataTypes.STRING,
                allowNull: true,
                defaultValue: "https://robohash.org/3L2.png?set=set4",
            },
            active: {
                type: Sequelize.DataTypes.BOOLEAN,
                defaultValue: true,
            },
            county_id: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DataTypes.DATE,
                defaultValue: Sequelize.DataTypes.NOW,
            },
            updated_at: {
                type: Sequelize.DataTypes.DATE,
                defaultValue: Sequelize.DataTypes.NOW,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("team");
    },
};
