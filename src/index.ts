import { readConfig, setUser } from "./config";

function main() {
  let cfg = readConfig();
  setUser(cfg, "Miguel");
  console.log(readConfig())
}

main();