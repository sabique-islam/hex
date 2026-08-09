import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(repoRoot, relativePath), "utf8"));
}

test("application versions stay aligned", async () => {
  const [rootPackage, rootLock] = await Promise.all([
    readJson("package.json"),
    readJson("package-lock.json"),
  ]);

  assert.equal(rootPackage.version, "0.9.3-beta");
  assert.equal(rootLock.version, rootPackage.version);
  assert.equal(rootLock.packages[""].version, rootPackage.version);
});

test("Docker images use the pinned presentation export runtime", async () => {
  const [rootPackage, dockerfile, dockerfileDev] = await Promise.all([
    readJson("package.json"),
    readFile(path.join(repoRoot, "Dockerfile"), "utf8"),
    readFile(path.join(repoRoot, "Dockerfile.dev"), "utf8"),
  ]);

  assert.equal(rootPackage.presentationExportVersion, "v0.4.2");
  assert.match(dockerfile, /COPY package\.json \/app\//);
  assert.match(dockerfile, /sync-presentation-export\.cjs --force/);
  assert.match(
    dockerfile,
    /resources\/document-extraction\/liteparse_runner\.mjs/,
  );
  assert.match(dockerfileDev, /COPY package\.json package-lock\.json \/app\//);
  assert.match(dockerfileDev, /sync-presentation-export\.cjs --force/);
  assert.match(
    dockerfileDev,
    /resources\/document-extraction\/liteparse_runner\.mjs/,
  );
});
