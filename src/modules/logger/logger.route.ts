import express, { Request, Response, NextFunction, Router } from "express";
import path from "path";
import fs from "fs";

const router: Router = express.Router();

router.use("/", (req, res, next) => {
    console.log("/logger");
    next();
});

router.get("/", (req, res) => {
    const logsDirectory = path.join(__dirname, "../../../", "logs");
    fs.readdir(logsDirectory, (err, files) => {
        if (err) {
            console.error("Error reading directory:", err);
            res.status(500).send("Error reading directory");
            return;
        }

        const fileNames = files.filter((file) => file.endsWith(".log"));
        const fileUrls = fileNames.map((fileName) => {
            return `<li style="margin-bottom: 20px;"><a href="/api/v1/logger/${fileName}">${fileName}</a></li>`;
        });

        const responseHtml = `
            <h1>Log Files</h1>
            <ul>
                ${fileUrls.reverse().join("")}
            </ul>
            `;
        res.send(responseHtml);
    });
});

router.get("/:id", (req, res) => {
    const filePath = `src/logs/${req.params.id}`;

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading the file:", err);
            res.status(500).send("Unable to find log file.");
            return;
        }

        // Split the file content into lines
        const lines = data.split("\n");
        const intoHTML = lines.map((log) => {
            return `<div>${log}</div>`;
        });
        const reverseByDate = intoHTML.reverse().join("\n");
        res.status(200).send(reverseByDate);
    });
});

export default router;
