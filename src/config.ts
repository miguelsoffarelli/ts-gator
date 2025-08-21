import os from "os";
import fs from "fs";
import path from "path";

export type Config = {
    dbUrl: string,
    currentUserName: string | undefined | null,
}

export function setUser(cfg: Config, username: string): void {
    cfg.currentUserName = username;
    writeConfig(cfg);
}

export function readConfig(): Config {
    const rawConfig = JSON.parse(fs.readFileSync(getConfigFilePath(), "utf-8"));
    return validateConfig(rawConfig);
}

function getConfigFilePath(): string {
    return path.join(os.homedir(), ".gatorconfig.json");
}

function writeConfig(cfg: Config): void {
    const stringifiedConfig = {
        db_url: cfg["dbUrl"],
        current_user_name: cfg["currentUserName"],
    }
    fs.writeFileSync(getConfigFilePath(), JSON.stringify(stringifiedConfig));
}

function validateConfig(rawConfig: any): Config {
    if (typeof rawConfig["db_url"] !== "string"
        || (rawConfig["current_user_name"] !== undefined && typeof rawConfig["current_user_name"] !== "string")) {
            throw new Error("Invalid config structure");
        }
    return {
        dbUrl: rawConfig["db_url"],
        currentUserName: rawConfig["current_user_name"],
    };
}