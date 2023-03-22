/**
 * Contrary to the TS typedefs, the API breaks if you pass `undefined` to an
 * optional property.
 */
export function removeUndefinedProperties<T extends Record<string, unknown>>(
  input: T,
) {
  return JSON.parse(JSON.stringify(input));
}
