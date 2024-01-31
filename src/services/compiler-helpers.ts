import os from "os";
import { python, java, cpp, node } from "@com.xcodeclazz/compile-run-v2";

function isNotLinux() {
  return /^win/.test(process.platform);
}

const errorLimitCharacter = 1000;
const resultLimitCharacter = 1000;
const defaultStdin = new Array(resultLimitCharacter).fill("0").join("\n");
// const forMinutes = 60000 /* 1 Min */ * 20; // should not take more then 20 minutes!
const forMinutes = 100000; // should not take more then 10 second!
const compilerOptions = {
  timeout: forMinutes / 10,
  compileTimeout: forMinutes,
  stderrLimit: errorLimitCharacter,
  stdoutLimit: resultLimitCharacter,
};

const compilersPath = {
  python: {
    compiler: python,
    compilationPath: "",
    executionPath: os.platform().includes("win") ? "python" : "python3",
  },
  java: {
    compiler: java,
    executionPath: "java",
    compilationPath: "javac",
  },
  cpp: {
    compiler: cpp,
    executionPath: "g++",
    compilationPath: "",
  },
  node: {
    compiler: node,
    executionPath: "node",
    compilationPath: "",
  },
};

export { compilersPath, compilerOptions, defaultStdin, forMinutes, isNotLinux };
