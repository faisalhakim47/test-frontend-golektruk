// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function assertInstanceOf<T>(value: unknown, constructor: new (...args: any[]) => T, message?: string): asserts value is T {
  if (!(value instanceof constructor)) {
    throw new Error(message || `Expected value to be an instance of ${constructor.name}`);
  }
}
