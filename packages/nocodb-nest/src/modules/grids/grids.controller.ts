import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ViewCreateReqType } from 'nocodb-sdk';
import {
  Acl,
  ExtractProjectIdMiddleware,
} from '../../middlewares/extract-project-id/extract-project-id.middleware';
import { GridsService } from './grids.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('grids')
@UseGuards(ExtractProjectIdMiddleware, AuthGuard('jwt'))
export class GridsController {
  get '/api/v1/db/meta/tables/:tableId/grids/'() {
    return this['_/api/v1/db/meta/tables/:tableId/grids/'];
  }
  constructor(private readonly gridsService: GridsService) {}

  @Post('/api/v1/db/meta/tables/:tableId/grids/')
  @Acl('gridViewCreate')
  async gridViewCreate(
    @Param('tableId') tableId: string,
    @Body() body: ViewCreateReqType,
  ) {
    const view = await this.gridsService.gridViewCreate({
      grid: body,
      tableId,
    });
    return view;
  }
  @Patch('/api/v1/db/meta/grids/:viewId')
  async gridViewUpdate(req, res) {
    return await this.gridsService.gridViewUpdate({
      viewId: req.params.viewId,
      grid: req.body,
    });
  }
}
