const fs = require("fs");
const path = require("path");

/**
 * Generate a complete module with the given filename.
 * @param filename The name of the module to generate
 * @returns void
 * @example node generateModule.ts user
 * - The module will contain the following files:
 * - user/index.ts
 * - user.controller.ts
 * - user.model.ts
 * - user.dto.ts
 * - user.validation.ts
 */

// Get the filename argument
const filename = process.argv[2];

if (!filename) {
    console.error("Please provide a filename argument.");
    process.exit(1);
}

// Define the directory and file paths
const folderPath = path.join(__dirname, "../modules", filename);

const fileNames = ["index.ts", `${filename}.controller.ts`, `${filename}.model.ts`, `${filename}.dto.ts`, `${filename}.validation.ts`];

// Create the folder if it doesn't exist
if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
}

// Create the files
fileNames.forEach((fileName) => {
    const filePath = path.join(folderPath, fileName);
    fs.writeFileSync(filePath, "", "utf8");
    console.log(`${fileName} created successfully.`);
});
