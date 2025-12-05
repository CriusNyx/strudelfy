import { assertEquals } from "jsr:@std/assert";
import { createStrudelFile } from "../main.ts";
import * as winPath from "@std/path/windows";
import * as linPath from "@std/path/posix";
import { Stub, stub } from "jsr:@std/testing/mock";

Deno.test("Can Generate Empty Strudel File", () => {
  const expected = {
    _base: "base",
  };
  const actual = createStrudelFile([], "", "base");

  assertEquals(actual, expected);
});

Deno.test("Can Generate Simple Strudel File", () => {
  Deno.test;

  const expected = {
    _base: "base",
    path: ["file/path.wav"],
  };

  const actual = createStrudelFile(
    ["/workingDir/file/path.wav"],
    "/workingDir/",
    "base",
  );

  assertEquals(actual, expected);
});

Deno.test("Can Generate Strudel File with count", () => {
  const expected = {
    _base: "base",
    path: ["file/path1.wav", "file/path2.wav"],
  };

  const actual = createStrudelFile(
    [
      "/workingDir/file/path1.wav",
      "/workingDir/file/path2.wav",
    ],
    "/workingDir/",
    "base",
  );

  assertEquals(actual, expected);
});

Deno.test("Can Generate Strudel File with windows path", () => {
  const expected = {
    _base: "base",
    path: ["file/path1.wav", "file/path2.wav"],
  };

  const actual = createStrudelFile(
    [
      "C:\\workingDir\\file\\path1.wav",
      "C:\\workingDir\\file\\path2.wav",
    ],
    "C:\\workingDir\\",
    "base",
  );

  assertEquals(actual, expected);
});
