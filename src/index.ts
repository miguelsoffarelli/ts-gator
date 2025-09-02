import { CommandsRegistry, registerCommand, runCommand } from "./lib/commands/command";
import { commandLogin } from "./lib/commands/command_login";
import { argv } from "process";
import { commandRegister } from "./lib/commands/command_register";
import { commandReset } from "./lib/commands/command_reset";
import { commandUsers } from "./lib/commands/command_users";
import { commandAgg } from "./lib/commands/command_agg";
import { commandAddfeed } from "./lib/commands/command_addfeed";
import { commandFeeds } from "./lib/commands/command_feeds";

async function main() {
  const registry: CommandsRegistry = {};
  registerCommand(registry, "login", commandLogin);
  registerCommand(registry, "register", commandRegister);
  registerCommand(registry, "reset", commandReset);
  registerCommand(registry, "users", commandUsers);
  registerCommand(registry, "agg", commandAgg);
  registerCommand(registry, "addfeed", commandAddfeed);
  registerCommand(registry, "feeds", commandFeeds);

  try {
    let args = argv.slice(2);  
    if (args.length === 0) {
      throw new Error("Not enough arguments provided");
    }

    const cmd = args[0];
    args = args.slice(1);
  
    await runCommand(registry, cmd, ...args);

  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    } else {
      console.log(err);
    }
    process.exit(1);
  }

  process.exit(0);
}

main();