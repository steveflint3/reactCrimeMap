declare module '*.scss' {
  const classes: Record<string, string>;
  export default classes;
}

declare module 'dotenv-webpack'