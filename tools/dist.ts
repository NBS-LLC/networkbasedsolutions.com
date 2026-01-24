import { copy, emptyDir } from "@std/fs";
import { resolve } from "@std/path";

function getVersion(): string {
  const semver = Deno.env.get("SEMVER");
  if (semver) {
    return semver;
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `development-${year}${month}${day}${hours}${minutes}${seconds}`;
}

async function main() {
  const version = getVersion();
  const srcDir = resolve(Deno.cwd(), "src");
  const distDir = resolve(Deno.cwd(), "dist");

  console.log("Cleaning dist directory...");
  await emptyDir(distDir);

  console.log(`Copying ${srcDir} to ${distDir}...`);
  await copy(srcDir, distDir, { overwrite: true });

  console.log(`Injecting version ${version} into index.html...`);
  const indexPath = resolve(distDir, "index.html");
  let indexHtml = await Deno.readTextFile(indexPath);
  indexHtml = indexHtml.replace("{version}", version);
  await Deno.writeTextFile(indexPath, indexHtml);

  console.log(`Build complete. Version: ${version}`);
}

if (import.meta.main) {
  main();
}
