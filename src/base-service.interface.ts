export interface BaseService<TOutput = unknown, TInput = unknown> {
  call(input?: TInput): TOutput;
}
