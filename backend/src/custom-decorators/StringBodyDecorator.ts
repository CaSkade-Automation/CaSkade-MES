import * as rawbody from 'raw-body';
import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';

export const StringBody = createParamDecorator(async (_, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest<import("express").Request>();
    if (!req.readable) {
        console.log("Invalid Body");
        throw new BadRequestException("Invalid body");
    }

    const body = (await rawbody(req)).toString("utf8").trim();
    return body;
});
