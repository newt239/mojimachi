import { Blob } from "buffer";

export type FontData = {
  family: string;
  fullName: string;
  postscriptName: string;
  style: string;
  blob: () => Promise<Blob>;
};
