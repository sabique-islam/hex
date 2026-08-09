declare module "*.wasm" {
  const url: string;
  export default url;
}

declare module "*.ttf" {
  const url: string;
  export default url;
}

declare module "@embedpdf/pdfium/pdfium.wasm" {
  const url: string;
  export default url;
}
