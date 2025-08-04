import type { Storage } from "./types";

// @ts-ignore
export async function createStorage(options: {}): Promise<Storage> {
  return {
    documents: "documents",
  };
}
