'use client';

// Este archivo ahora solo re-exporta los hooks y componentes.
// La lógica de inicialización ha sido movida para prevenir errores.

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './errors';
export * from './error-emitter';
export { initializeFirebase } from './init'; // Exporta la función de inicialización si es necesario en otros lugares.
