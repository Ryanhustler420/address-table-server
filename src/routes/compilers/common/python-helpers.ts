import { performance } from "perf_hooks";
import { ILanguage } from "@com.xcodeclazz/monolithic-common";
import {
  python,
  CompilersPayload_Python,
  CompilersResponse_Python,
} from "@com.xcodeclazz/compile-run-v2";
import {
  isNotLinux,
  defaultStdin,
  compilersPath,
  compilerOptions,
} from "../../../services/compiler-helpers";

export async function nativePackageCompiler(data: CompilersPayload_Python): Promise<CompilersResponse_Python> {
  return await new Promise((resolve, reject) => {
    var startTime = performance.now();
    python
      .runFiles(
        data.sources,
        {
          ...compilerOptions,
          stdin: data.input || defaultStdin,
          executionPath: compilersPath.python.executionPath,
          compilationPath: compilersPath.python.compilationPath,
        },
        (result) => {
          if (result.executionResult && isNotLinux())
            result.executionResult.stdout =
              result.executionResult.stdout?.replace("\r", "");
          if (result.executionResult) result.executionResult.exitCode = result.executionResult?.stderr ? 1 : 0;
          var endTime = performance.now();
          var ms = endTime - startTime;
          const response: CompilersResponse_Python = {
            result: {
              ...result,
              ms,
              lang: ILanguage.Python,
              isSucceed: result.executionResult?.stderr ? false : true,
            },
          };
          resolve(response);
        }
      )
      .catch(reject);
  });
}
