/**
 * Hide / block / report / privacy features depend on migration
 * 20260925100000_hide_block_report_privacy.sql. Until it is applied, queries
 * on the new tables/columns fail with "undefined table/column" errors; callers
 * use these helpers to degrade gracefully instead of crashing.
 */
export const FEATURE_UNAVAILABLE =
  "This feature is unavailable until the database is updated.";

type MaybeError = { code?: string | null; message?: string | null } | null | undefined;

const MISSING_SCHEMA_CODES = new Set([
  "42P01", // undefined_table
  "42703", // undefined_column
  "42704", // undefined_object (e.g. enum type)
  "42883", // undefined_function
  "PGRST200", // relationship not found in the schema cache
  "PGRST202", // function not found in the schema cache
  "PGRST204", // column not found in the schema cache
  "PGRST205", // table not found in the schema cache
]);

/** True when the error means "the migration has not been applied yet". */
export function isMissingSchemaError(error: MaybeError): boolean {
  if (!error) return false;
  if (error.code && MISSING_SCHEMA_CODES.has(error.code)) return true;
  const message = error.message ?? "";
  return /does not exist|schema cache/i.test(message);
}

/** Row rejected by an RLS policy (blocked user, privacy or comment settings). */
export function isPolicyViolation(error: MaybeError): boolean {
  return error?.code === "42501" || /row-level security/i.test(error?.message ?? "");
}

/** Unique-constraint violation (e.g. a duplicate report). */
export function isUniqueViolation(error: MaybeError): boolean {
  return error?.code === "23505";
}
