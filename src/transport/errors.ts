export function hasErrorCode(error: unknown, code: string): boolean {
    return error instanceof Error && error.message === code;
}

// 23505 — нарушение unique-ограничения в Postgres
export function isUniqueViolation(error: unknown): boolean {
    return (
        error !== null &&
        typeof error === "object" &&
        "sqlState" in error &&
        error.sqlState === "23505"
    );
}
