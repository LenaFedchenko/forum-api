// коды ошибок Postgres: 23505 — нарушение unique, 23503 — нет связанной строки (foreign key)
function hasSqlState(error: unknown, sqlState: string): error is object {
	return (
		error !== null &&
		typeof error === "object" &&
		"sqlState" in error &&
		error.sqlState === sqlState
	);
}

export function isUniqueViolation(error: unknown): boolean {
	return hasSqlState(error, "23505");
}

export function isForeignKeyViolation(
	error: unknown,
	constraint: string,
): boolean {
	return (
		hasSqlState(error, "23503") &&
		"constraint" in error &&
		error.constraint === constraint
	);
}
