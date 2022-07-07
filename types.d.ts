declare module "*.module.css" {
  export type CSS = {
    [x: string]: string;
  };
  const css: CSS;
  export default css;
}
