const fs = require("fs");
const path = require("path");

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
    if (
        !file.endsWith(".js") &&
        !file.endsWith(".mjs") &&
        !file.endsWith(".cjs") &&
        !file.endsWith(".d.ts")
    )
        return;
    let contents = fs.readFileSync(file, "utf8");
    const before = contents;
    contents = contents
        .replace(/from \"@schema\"/g, 'from "./schema"')
        .replace(/from '\\@schema'/g, "from './schema'")
        .replace(/from \"@db\"/g, 'from "./database"')
        .replace(/from '\\@db'/g, "from './database'");
    if (contents !== before) {
        fs.writeFileSync(file, contents, "utf8");
        console.log("Rewrote imports in", file);
    }
});

console.log("Done rewriting imports.");
