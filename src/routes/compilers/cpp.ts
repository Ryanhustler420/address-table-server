import _ from "lodash";
import axios from "axios";
import { getFreeUrlByTags } from "./helper/methods";
import express, { Request, Response } from "express";
import { nativePackageCompiler } from "./common/cpp-helpers";
import { celebrate, Segments } from "@com.xcodeclazz/celebrate";
import { CompilersPayloadJoi_Cpp, CompilersResponse_Cpp } from "@com.xcodeclazz/compile-run-v2";

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
      const response: CompilersResponse_Cpp = await nativePackageCompiler(req.body);
      res.json(response);
    }
  }
);

export { router as compilersCppRouter };
