// В Node 22 нет глобального Temporal, а Prisma нужен он для DateTime-полей
import "temporal-polyfill/global";
import postgres, { type PostgresClient } from "@prisma/orm-postgres/runtime";
import type { Contract } from "./contract.d.ts";
import contractJson from "./contract.json" with { type: "json" };

export type Database = PostgresClient<Contract>;

export function createDb(url: string): Database {
	return postgres<Contract>({ contractJson, url });
}
