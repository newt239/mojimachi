import { Blob } from "buffer";

export type FontInfo = {
  family: string;
  postscript_name: string;
};

export type FontData = {
  family: string;
  fullName: string;
  postscriptName: string;
  style: string;
  blob: () => Promise<Blob>;
};

export type JAAbility = { ja?: "supported" | "undetermind" };

export type FontList = Omit<FontData & JAAbility, "blob">[];
