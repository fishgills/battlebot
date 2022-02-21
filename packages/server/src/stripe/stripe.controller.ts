import { Controller, Get, Query, Request, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('stripe')
export class StripeController {
  @Get('/success')
  success(@Query('sid') sid: string, @Request() req, @Res() res: Response) {
    if (!req.user) {
      return res.redirect(`https://www.${process.env.DOMAIN}/home`);
    }
    console.log(req.user);
    res.send(sid);
  }

  @Get('/cancel')
  cancel(@Request() req: Request, @Res() res: Response) {
    return res.redirect(`https://www.${process.env.DOMAIN}/tavern`);
  }
}
