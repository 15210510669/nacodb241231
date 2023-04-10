import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilterReqType } from 'nocodb-sdk';
import { PagedResponseImpl } from '../../helpers/PagedResponse';
import {
  Acl,
  ExtractProjectIdMiddleware,
  UseAclMiddleware,
} from '../../middlewares/extract-project-id/extract-project-id.middleware';
import { FiltersService } from './filters.service';

@Controller()
@UseGuards(ExtractProjectIdMiddleware, AuthGuard('jwt'))
export class FiltersController {
  constructor(private readonly filtersService: FiltersService) {}

  @Get('/api/v1/db/meta/views/:viewId/filters')
  @Acl('filterList')
  async filterList(@Param('viewId') viewId: string) {
    return new PagedResponseImpl(
      await this.filtersService.filterList({
        viewId,
      }),
    );
  }

  @Post('/api/v1/db/meta/views/:viewId/filters')
  @Acl('filterCreate')
  async filterCreate(
    @Param('viewId') viewId: string,
    @Body() body: FilterReqType,
  ) {
    const filter = await this.filtersService.filterCreate({
      filter: body,
      viewId: viewId,
    });
    return filter;
  }

  @Post('/api/v1/db/meta/hooks/:hookId/filters')
  @Acl('hookFilterCreate')
  async hookFilterCreate(
    @Param('hookId') hookId: string,
    @Body() body: FilterReqType,
  ) {
    const filter = await this.filtersService.hookFilterCreate({
      filter: body,
      hookId,
    });
    return filter;
  }

  @Get('/api/v1/db/meta/filters/:filterId')
  @Acl('filterGet')
  async filterGet(@Param('filterId') filterId: string) {
    return await this.filtersService.filterGet({ filterId });
  }

  @Get('/api/v1/db/meta/filters/:filterParentId/children')
  @Acl('filterChildrenList')
  async filterChildrenRead(filterParentId: string) {
    return new PagedResponseImpl(
      await this.filtersService.filterChildrenList({
        filterId: filterParentId,
      }),
    );
  }

  @Patch('/api/v1/db/meta/filters/:filterId')
  @Acl('filterUpdate')
  async filterUpdate(
    @Param('filterId') filterId: string,
    @Body() body: FilterReqType,
  ) {
    const filter = await this.filtersService.filterUpdate({
      filterId: filterId,
      filter: body,
    });
    return filter;
  }

  @Delete('/api/v1/db/meta/filters/:filterId')
  @Acl('filterDelete')
  async filterDelete(@Param('filterId') filterId: string) {
    const filter = await this.filtersService.filterDelete({
      filterId,
    });
    return filter;
  }

  @Get('/api/v1/db/meta/hooks/:hookId/filters')
  @Acl('hookFilterList')
  async hookFilterList(@Param('hookId') hookId: string) {
    return new PagedResponseImpl(
      await this.filtersService.hookFilterList({
        hookId: hookId,
      }),
    );
  }
}
