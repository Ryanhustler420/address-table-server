import _ from "lodash";
import axios from "axios";
import { getFreeUrlByTags } from "./helper/methods";
import express, { Request, Response } from "express";
import { numberSequenceGenerator } from "../../services/utils";
import { celebrate, Segments } from "@com.xcodeclazz/celebrate";
import { CompilersPayloadJoi_Java, CompilersResponse_Java } from "@com.xcodeclazz/compile-run-v2";

const router = express.Router();
const number = numberSequenceGenerator(2); // NOTE: decide number of compilers services

router.post("/api/compilers/java",
  celebrate({ [Segments.BODY]: CompilersPayloadJoi_Java }),
  async (req: Request, res: Response) => {
    const freeUrl = await getFreeUrlByTags(['java']);
    if (freeUrl?.url) {
      try {
        const hitpoint = `${freeUrl.url}/api/compilers/java`;
        const result = await axios.post(hitpoint, req.body);
        const response: CompilersResponse_Java = result.data;
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

export { router as compilersJavaRouter };
