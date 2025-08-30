import { CommandsRegistry, registerCommand, runCommand } from "./command";
import { commandLogin } from "./command_login";
import { argv } from "process";
import { commandRegister } from "./command_register";
import { commandReset } from "./command_reset";
import { commandUsers } from "./command_users";

async function main() {
  const registry: CommandsRegistry = {};
  registerCommand(registry, "login", commandLogin);
  registerCommand(registry, "register", commandRegister);
  registerCommand(registry, "reset", commandReset);
  registerCommand(registry, "users", commandUsers);

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