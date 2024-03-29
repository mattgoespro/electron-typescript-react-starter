import { rimraf } from "rimraf";

export async function cleanDirectories(directories: string[]) {
  return rimraf(directories);
}
