"use strict";

import fs from "fs";

const PACKAGES = ["FileSelector", "CenterLoader"];

try {
  PACKAGES.forEach((name) => {
    fs.writeFileSync(
      `./dist/${name}/package.json`,
      `{
  "type": "module",
  "module": "./index.js",
  "main": "./index.cjs",
  "types": "./index.d.ts"
}
    `,
    );
  });
} catch (error) {
  console.error(error);
}
