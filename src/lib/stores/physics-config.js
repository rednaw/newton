import { writable } from 'svelte/store';
import { physicsConfig as defaultConfig } from '../physics-config';

export const physicsConfig = writable({
    G: defaultConfig.G,
    DT: defaultConfig.DT,
    SOFTENING: defaultConfig.SOFTENING
});

