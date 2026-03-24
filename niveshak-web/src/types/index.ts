export * from './onboarding';
export * from './instruments';
export * from './navigation';

// Makes every key in T required and non-nullable
export type Complete<T> = {
	[K in keyof T]-?: NonNullable<T[K]>;
};

// Extracts the resolved type from a Promise
export type Awaited<T> = T extends Promise<infer U> ? U : T;
// placeholder — index.ts — implementation coming