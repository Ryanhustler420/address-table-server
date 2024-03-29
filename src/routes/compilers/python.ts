import _ from "lodash";
import axios from "axios";
import { getFreeUrlByTags } from "./helper/methods";
import express, { Request, Response } from "express";
import { celebrate, Segments } from "@com.xcodeclazz/celebrate";
import { nativePackageCompiler } from "./common/python-helpers";
import { CompilersPayloadJoi_Python, CompilersResponse_Python } from "@com.xcodeclazz/compile-run-v2";

const router = express.Router();

router.post("/api/compilers/python",
  celebrate({ [Segments.BODY]: CompilersPayloadJoi_Python }),
  async (req: Request, res: Response) => {
    const freeUrl = await getFreeUrlByTags(['python']);
    if (freeUrl?.url) {
      try {
        const hitpoint = `${freeUrl.url}/api/compilers/python`;
        const result = await axios.post(hitpoint, req.body);
        const response: CompilersResponse_Python = result.data;
        res.json(response);
      } catch (error) {
        // @ts-ignore
        console.error(error?.message);
        res.json({ result: null });
      }
    } else {
      const response: CompilersResponse_Python = await nativePackageCompiler(req.body);
      res.json(response);
    }
  }
);

export { router as compilersPythonRouter };
