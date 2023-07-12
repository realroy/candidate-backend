import type { TransformFnParams, TransformOptions } from 'class-transformer';

export function toNumber(
  { value }: TransformFnParams,
  options?: TransformOptions,
) {
  return +value;
}
