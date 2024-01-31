import { ILanguage } from "@com.xcodeclazz/monolithic-common";
import {
  cpp,
  CompilersPayload_Cpp,
  CompilersResponse_Cpp,
} from "@com.xcodeclazz/compile-run-v2";

import {
  isNotLinux,
  defaultStdin,
  compilersPath,
  compilerOptions,
} from "../../../services/compiler-helpers";

export async function nativePackageCompiler(data: CompilersPayload_Cpp): Promise<CompilersResponse_Cpp> {
  return await new Promise<any>((resolve, reject) => {
    var startTime = performance.now();
    cpp
      .runFiles(
        data.sources,
        {
          ...compilerOptions,
          stdin: data.input || defaultStdin,
          executionPath: compilersPath.cpp.executionPath,
          compilationPath: compilersPath.cpp.compilationPath,
        },
        (result) => {
          if (result.executionResult && isNotLinux())
            result.executionResult.stdout =
              result.executionResult.stdout?.replace("\r", "");
          var endTime = performance.now();
          var ms = endTime - startTime;
          const response: CompilersResponse_Cpp = {
            result: {
              ...result,
              ms,
              lang: ILanguage.Cpp,
              isSucceed: result.executionResult?.stderr ? false : true,
            },
          };
          resolve(response);
        }
      )
      .catch(reject);
  });
}
