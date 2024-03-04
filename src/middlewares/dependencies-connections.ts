import { Request, Response, NextFunction } from "express";
import { DependenciesConnections, BadRequestError } from "@com.xcodeclazz/monolithic-common";

export const dependenciesConnections = (req: Request, res: Response, next: NextFunction) => {
  let service = [];
  let message: string;
  if (!DependenciesConnections.getInstance().getMongoDb()) service.push("DB");
  if (!DependenciesConnections.getInstance().getRabbitMq()) service.push("MQ");
  if (DependenciesConnections.getInstance().allOk()) next();
  else {
    if (service.length === 1) message = service[0];
    else message = `${service.slice(0, -1).join(", ")} && ${service.slice(-1)}`;
    throw new BadRequestError(`${message} is down`);
  }
};
