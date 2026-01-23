import fs from "node:fs/promises";
import path from "node:path";

import { glob } from "glob";
import yaml from "js-yaml";

import type { ShowYaml } from "./types.js";

export async function findShowYamlFiles(showsDir: string): Promise<string[]> {
  const pattern = path.posix.join(showsDir.replace(/\\/g, "/"), "**/*.yml");
  const files = await glob(pattern, { nodir: true });
  return files.sort();
}

export async function loadShowYaml(filePath: string): Promise<ShowYaml> {
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = yaml.load(raw);

  if (!parsed || typeof parsed !== "object") {
    throw new Error(`Invalid YAML (expected an object): ${filePath}`);
  }

  return parsed as ShowYaml;
}
