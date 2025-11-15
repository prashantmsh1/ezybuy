import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "..", "dist");

function walk(dir, cb) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) walk(full, cb);
        else cb(full);
    }
}

walk(distDir, (file) => {
    if (!file.endsWith(".js")) return;
    let contents = fs.readFileSync(file, "utf8");
    const before = contents;

    contents = contents
        .replace(/from "\.\/schema"/g, 'from "./schema/index.js"')
        .replace(/from '\.\/schema'/g, "from './schema/index.js'")
        .replace(/from "\.\/product"/g, 'from "./product.js"')
        .replace(/from '\.\/product'/g, "from './product.js'")
        .replace(/from "\.\/user"/g, 'from "./user.js"')
        .replace(/from '\.\/user'/g, "from './user.js'")
        .replace(/from "\.\/(_relations)"/g, 'from "./$1.js"')
        .replace(/from '\.\/(_relations)'/g, "from './$1.js'")
        .replace(/from "\.\/database"/g, 'from "./database.js"')
        .replace(/from '\.\/database'/g, "from './database.js'");

    if (contents !== before) {
        fs.writeFileSync(file, contents, "utf8");
        console.log("Fixed imports in", file);
    }
});

console.log("Done fixing relative imports.");
