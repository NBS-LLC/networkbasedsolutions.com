import { join } from "@std/path";
// @deno-types="npm:@types/ssh2-sftp-client"
import SftpClient from "ssh2-sftp-client";

const config = {
  host: Deno.env.get("SFTP_HOST"),
  username: Deno.env.get("SFTP_USERNAME"),
  password: Deno.env.get("SFTP_PASSWORD"),
  remoteDir: Deno.env.get("SFTP_PATH"),
  localDir: "./dist",
  exclude: [".dh-diag"],
};

if (!config.host || !config.username || !config.password || !config.remoteDir) {
  throw new Error("Missing required SFTP environment variables.");
}

const sftp = new SftpClient();

try {
  await sftp.connect(config);

  const list = await sftp.list(config.remoteDir);
  for (const item of list) {
    if (!config.exclude.includes(item.name)) {
      const remotePath = join(config.remoteDir, item.name);
      item.type === "d" ? await sftp.rmdir(remotePath, true) : await sftp.delete(remotePath);
    }
  }

  await sftp.uploadDir(config.localDir, config.remoteDir);
  console.log("Deployment successful.");
} catch (err) {
  const msg = err instanceof Error ? err.message : err;
  console.error("Deployment failed:", msg);
} finally {
  await sftp.end();
}
