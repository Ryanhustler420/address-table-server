import _ from "lodash";
import axios from "axios";
import { getFreeUrlByTags } from "./helper/methods";
import express, { Request, Response } from "express";
import { celebrate, Segments } from "@com.xcodeclazz/celebrate";
import { CompilersPayloadJoi_Python } from "@com.xcodeclazz/compile-run-v2";

const router = express.Router();

router.post("/api/compilers/python",
  celebrate({ [Segments.BODY]: CompilersPayloadJoi_Python }),
  async (req: Request, res: Response) => {
    const freeUrl = await getFreeUrlByTags(['python']);
    if (freeUrl?.url) {
      try {
        const hitpoint = `${freeUrl.url}/api/compilers/python`;
        const result = await axios.post(hitpoint, req.body);
        res.json(result.data);
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

export { router as compilersPythonRouter };
