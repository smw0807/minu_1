import * as aModule from './a.mjs';
export let loaded = false;
export const b = aModule;
loaded = true;