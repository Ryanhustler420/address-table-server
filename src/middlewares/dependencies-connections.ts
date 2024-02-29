import { Request, Response, NextFunction } from "express";
import { InternalServerError, DependenciesConnections } from "@com.xcodeclazz/monolithic-common";

export const dependenciesConnections = (req: Request, res: Response, next: NextFunction) => {
  if (DependenciesConnections.getInstance().allOk()) next();
  else throw new InternalServerError("Mq Down");
};
