import { createParamDecorator } from '@nestjs/common';
export const GetUser = createParamDecorator((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
});
//# sourceMappingURL=get-user.decorator.js.map