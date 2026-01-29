import { assertEquals } from "@std/assert";
import { DOMParser } from "@b-fuze/deno-dom";

const scriptName = import.meta.url.split("/").pop();
const url = Deno.args[0];
const semver = Deno.env.get("TAG")?.replace(/^v/, "");

if (!url || !semver) {
  console.error(`Usage: TAG=v1.2.3 deno run --allow-net --allow-env ${scriptName} <url>`);
  Deno.exit(1);
}

const result = await fetch(url);
const html = await result.text();
const document = new DOMParser().parseFromString(html, "text/html");
const version = document.querySelector('meta[name="version"]')?.getAttribute("content");

assertEquals(version, semver, "deployed version");
