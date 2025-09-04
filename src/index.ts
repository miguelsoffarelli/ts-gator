import { CommandsRegistry, registerCommand, runCommand } from "./lib/commands/command";
import { argv } from "process";
import {
  commandUsers, 
  commandLogin, 
  commandRegister, 
  commandReset 
} from "./lib/commands/command_users";
import { 
  commandFeeds, 
  commandAddfeed, 
  commandAgg, 
  commandFollow, 
  commandFollowing 
} from "./lib/commands/command_feeds";
import { middlewareLoggedIn } from "./lib/commands/middleware";

async function main() {
  const registry: CommandsRegistry = {};
  registerCommand(registry, "login", commandLogin);
  registerCommand(registry, "register", commandRegister);
  registerCommand(registry, "reset", commandReset);
  registerCommand(registry, "users", commandUsers);
  registerCommand(registry, "agg", commandAgg);
  registerCommand(registry, "addfeed", middlewareLoggedIn(commandAddfeed));
  registerCommand(registry, "feeds", commandFeeds);
  registerCommand(registry, "follow", middlewareLoggedIn(commandFollow));
  registerCommand(registry, "following", middlewareLoggedIn(commandFollowing));

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