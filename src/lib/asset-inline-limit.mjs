// Las fuentes nunca se incrustan como data URI: la CSP usa font-src 'self'.
// Devolver `undefined` mantiene el límite por defecto de Vite para el resto.
export const assetsInlineLimit = (filePath) =>
  /\.(woff2?|ttf|otf|eot)$/i.test(filePath) ? false : undefined;
