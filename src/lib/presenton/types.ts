export type PresentonGenerateRequest = {
  prompt: string;
  template?: string;
  nSlides?: number;
  language?: string;
  instructions?: string;
};

export type PresentonGenerateResponse = {
  fileName: string;
  bytesBase64: string;
  presentationId: string;
  editPath?: string;
};
