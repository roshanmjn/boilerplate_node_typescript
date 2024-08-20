import { Application } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Futsal API",
            description: "API endpoints for Futsal Observer documented on swagger",
            contact: {
                name: "Roshan Maharjan",
                email: "ma.roshan2@gmail.com",
                url: "https://github.com/byteperks/futsal_backend",
            },
            version: "1.0.0",
        },
        servers: [
            {
                url: "http://localhost:3000/",
                description: "Local server",
            },
            {
                url: "api-futsal.byteperks.com",
                description: "Live server",
            },
        ],
    },
    // looks for configuration in specified directories
    apis: [`${__dirname}/modules/**/*.ts`],
};
// console.log(__dirname);
const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
