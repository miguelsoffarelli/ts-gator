import { CommandsRegistry, registerCommand, runCommand } from "./command";
import { commandLogin } from "./command_login";
import { argv } from "process";

function main() {
  const registry: CommandsRegistry = {};
  registerCommand(registry, "login", commandLogin);

  try {
    let args = argv.slice(2);  
    if (args.length === 0) {
      throw new Error("Not enough arguments provided");
    }

    const cmd = args[0];
    args = args.slice(1);
  
    runCommand(registry, cmd, ...args);

  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    } else {
      console.log(err);
    }
    process.exit(1);
  }

}

main();