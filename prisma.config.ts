import "dotenv/config";
import { definePrismaConfig } from "@prisma/cli-engine";
import { defineConfig as ormConfig } from "@prisma/orm-postgres/config";

const databaseUrl = process.env["DATABASE_URL"];
if (!databaseUrl) {
	throw new Error("DATABASE_URL is not defined");
}

export default definePrismaConfig({
	orm: ormConfig({
		contract: "./src/prisma/schema/*.prisma",
		output: "./src/prisma",
		db: {
			connection: databaseUrl,
		},
	}),
});
