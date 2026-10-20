/// <reference types="vite/client" />

// Vite's `?url` asset imports resolve to a string URL at build time.
declare module '*.css?url' {
  const url: string
  export default url
}
