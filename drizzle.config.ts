import { defineConfig } from "drizzle-kit";
import { readConfig } from "./src/config";

export default defineConfig({
  schema: "src/lib/db/schema",
  out: "src/lib/db",
  dialect: "postgresql",
  dbCredentials: {
    url: readConfig().dbUrl,
  },
});