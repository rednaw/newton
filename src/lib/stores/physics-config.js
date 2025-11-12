import { writable } from 'svelte/store';

export const physicsConfig = writable({
	G: 500,
	DT: 0.1,
	SOFTENING: 100
});
