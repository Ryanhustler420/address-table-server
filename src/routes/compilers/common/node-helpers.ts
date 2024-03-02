import {
  node,
  CompilersPayload_Node,
  CompilersResponse_Node,
} from "@com.xcodeclazz/compile-run-v2";
import {
  isNotLinux,
  defaultStdin,
  compilersPath,
  compilerOptions,
} from "../../../services/compiler-helpers";

export async function nativePackageCompiler(data: CompilersPayload_Node): Promise<CompilersResponse_Node> {
  return await new Promise((resolve, reject) => {
    var startTime = performance.now();
    node
      .runFiles(
        data.sources,
        {
          ...compilerOptions,
          stdin: data.input || defaultStdin,
          executionPath: compilersPath.node.executionPath,
          compilationPath: compilersPath.node.compilationPath,
        },
        (result) => {
          if (result.executionResult && isNotLinux())
            result.executionResult.stdout =
              result.executionResult.stdout?.replace("\r", "");
          if (result.executionResult) result.executionResult.exitCode = result.executionResult?.stderr ? 1 : 0;
          var endTime = performance.now();
          var ms = endTime - startTime;
          const response: CompilersResponse_Node = {
            result: {
              ...result,
              ms,
              lang: "node",
              isSucceed: result.executionResult?.stderr ? false : true,
            },
          };
          resolve(response);
        }
      )
      .catch(reject);
  });
}
