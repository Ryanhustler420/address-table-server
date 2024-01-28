import _ from "lodash";
import axios from "axios";
import { getFreeUrlByTags } from "./helper/methods";
import express, { Request, Response } from "express";
import { celebrate, Segments } from "@com.xcodeclazz/celebrate";
import { CompilersPayloadJoi_Node, CompilersResponse_Node } from "@com.xcodeclazz/compile-run-v2";

const router = express.Router();

router.post("/api/compilers/node",
  celebrate({ [Segments.BODY]: CompilersPayloadJoi_Node }),
  async (req: Request, res: Response) => {
    const freeUrl = await getFreeUrlByTags(['node']);
    if (freeUrl?.url) {
      try {
        const hitpoint = `${freeUrl.url}/api/compilers/node`;
        const result = await axios.post(hitpoint, req.body);
        const response: CompilersResponse_Node = result.data;
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

export { router as compilersNodeRouter };
