export type Await<T> = T extends Promise<infer U> ? U : T

export type PromiseOrValue<T> = Promise<T> | T
export type ObjectKeys<T> = Extract<keyof T, string>
export type ObjectValues<T> = T[ObjectKeys<T>]
export const objectKeys = <T>(obj: T) => Object.keys(obj) as ObjectKeys<T>[]

export type Tuplify<T extends any[]> = [T[number], T[number], ...T]
