import _ from "lodash";
import axios from "axios";
import { parse } from "node-html-parser";
import { performance } from 'perf_hooks';
import { getFreeUrlByTags } from "./helper/methods";
import express, { Request, Response } from "express";
import { celebrate, Segments } from "@com.xcodeclazz/celebrate";
import { CompilersPayloadJoi_Cpp, CompilersPayload_Cpp, CompilersResponse_Cpp } from "@com.xcodeclazz/compile-run-v2";

const router = express.Router();

router.post("/api/compilers/cpp",
  celebrate({ [Segments.BODY]: CompilersPayloadJoi_Cpp }),
  async (req: Request, res: Response) => {
    const freeUrl = await getFreeUrlByTags(['cpp']);
    if (freeUrl?.url) {
      try {
        const hitpoint = `${freeUrl.url}/api/compilers/cpp`;
        const result = await axios.post(hitpoint, req.body);
        const response: CompilersResponse_Cpp = result.data;
        res.json(response);
      } catch (error) {
        // @ts-ignore
        console.error(error?.message);
        res.json({ result: null });
      }
    } else {
      res.json({ result: null });
    }
  }
);

// No user input allowed here...
router.post("/api/compilers/cpp/plain",
  celebrate({ [Segments.BODY]: CompilersPayloadJoi_Cpp }),
  async (req: Request, res: Response) => {
    const body : CompilersPayload_Cpp = req.body;
    
    const formdata = new FormData();
    formdata.append("code", body?.sources[0]?.content);

    var started = performance.now();
    try {
      const hitpoint = `https://try.w3schools.com/try_cpp.php?x=${Math.random()}`;
      const response = await axios({
        url: hitpoint,
        data: formdata,
        method: 'post',
      });
      var end = performance.now();
      var ms = end - started;
      var html = parse(response.data);
      var t = html.querySelector('pre');
      if (!t) return res.json({ result: null });

      var sanitize = JSON.stringify(t.text);
      var stderr = sanitize.toLowerCase().includes("error:") ? sanitize : '';
      var stdout = !sanitize.toLowerCase().includes("error:") ? sanitize : '';
      const send: CompilersResponse_Cpp = {
        result: {
          ms,
          lang: 'cpp',
          isSucceed: true,
          status: 'success',
          executionResult: {
            cpuUsage: 0,
            exitCode: 0,
            memoryUsage: 0,
            signal: null,
            stderr,
            stdout
          }
        }
      };
      res.json(send);
    } catch (error) {
      // @ts-ignore
      console.error(error?.message);
      res.json({ result: null });
    }
  }
);

export { router as compilersCppRouter };
