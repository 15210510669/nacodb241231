import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GalleryUpdateReqType, ViewCreateReqType } from 'nocodb-sdk';
import {
  Acl,
  ExtractProjectIdMiddleware,
} from '../../middlewares/extract-project-id/extract-project-id.middleware';
import { GalleriesService } from './galleries.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('galleries')
@UseGuards(ExtractProjectIdMiddleware, AuthGuard('jwt'))
export class GalleriesController {
  constructor(private readonly galleriesService: GalleriesService) {}

  @Get('/api/v1/db/meta/galleries/:galleryViewId')
  @Acl('galleryViewGet')
  async galleryViewGet(@Param('galleryViewId') galleryViewId: string) {
    return await this.galleriesService.galleryViewGet({
      galleryViewId,
    });
  }

  @Post('/api/v1/db/meta/tables/:tableId/galleries')
  @Acl('galleryViewCreate')
  async galleryViewCreate(
    @Param('tableId') tableId: string,
    @Body() body: ViewCreateReqType,
  ) {
    return await this.galleriesService.galleryViewCreate({
      gallery: body,
      // todo: sanitize
      tableId,
    });
  }

  @Patch('/api/v1/db/meta/galleries/:galleryViewId')
  @Acl('galleryViewUpdate')
  async galleryViewUpdate(
    @Param('galleryViewId') galleryViewId: string,
    @Body() body: GalleryUpdateReqType,
  ) {
    return await this.galleriesService.galleryViewUpdate({
      galleryViewId,
      gallery: body,
    });
  }
}
