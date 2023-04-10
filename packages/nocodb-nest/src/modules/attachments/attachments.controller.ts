import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  Response,
  UploadedFiles, UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import multer from 'multer';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { OrgUserRoles, ProjectRoles } from 'nocodb-sdk';
import path from 'path';
import { NC_ATTACHMENT_FIELD_SIZE } from '../../constants';
import { NcError } from '../../helpers/catchError';
import { UploadAllowedInterceptor } from '../../interceptors/is-upload-allowed/is-upload-allowed.interceptor';
import { ExtractProjectIdMiddleware } from '../../middlewares/extract-project-id/extract-project-id.middleware'
import Noco from '../../Noco';
import { MetaTable } from '../../utils/globals';
import { AttachmentsService } from './attachments.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @UseGuards(ExtractProjectIdMiddleware, AuthGuard('jwt'))
  @Post(
    '/api/v1/db/storage/upload',
    //   multer({
    //            storage: multer.diskStorage({}),
    // limits: {
    //   fieldSize: NC_ATTACHMENT_FIELD_SIZE,
    // },
    // }).any(),
    //   [
    //     extractProjectIdAndAuthenticate,
    //     catchError(isUploadAllowedMw),
    //     catchError(upload),
    //   ]
    // );
  )
  @UseInterceptors(
    UploadAllowedInterceptor,
    FilesInterceptor('files[]', null, {
      storage: multer.diskStorage({}),
      // limits: {
      //   fieldSize: NC_ATTACHMENT_FIELD_SIZE,
      // },
      limits: {
        fileSize: NC_ATTACHMENT_FIELD_SIZE,
      },
    }),
  )
  async upload(
    @UploadedFiles() files: Array<any>,
    @Body() body: any,
    @Request() req: any,
    @Query('path') path: string,
  ) {
    const attachments = await this.attachmentsService.upload({
      files: files,
      path: req.query?.path as string,
    });

    return attachments;
  }

  @Post('/api/v1/db/storage/upload-by-url')
  @UseInterceptors(UploadAllowedInterceptor)
  //   [
  //     extractProjectIdAndAuthenticate,
  //   catchError(isUploadAllowedMw),
  //   catchError(uploadViaURL),
  // ]
  // );
  @UseGuards(ExtractProjectIdMiddleware, AuthGuard('jwt'))
  async uploadViaURL(@Body() body: any, @Query('path') path: string) {
    const attachments = await this.attachmentsService.uploadViaURL({
      urls: body,
      path,
    });

    return attachments;
  }

  // @Get(/^\/download\/(.+)$/)
  // , getCacheMiddleware(), catchError(fileRead));
  @Get('/download/:filename(*)')
  // This route will match any URL that starts with
  async fileRead(@Param('filename') filename: string, @Response() res) {
    try {
      const { img, type } = await this.attachmentsService.fileRead({
        path: path.join('nc', 'uploads', filename),
      });

      res.writeHead(200, { 'Content-Type': type });
      res.end(img, 'binary');
    } catch (e) {
      console.log(e);
      res.status(404).send('Not found');
    }
  }

  // @Get(/^\/dl\/([^/]+)\/([^/]+)\/(.+)$/)
  @Get('/dl/:param1([a-zA-Z0-9_-]+)/:param2([a-zA-Z0-9_-]+)/:filename(*)')
  // getCacheMiddleware(),
  async fileReadv2(
    @Param('param1') param1: string,
    @Param('param2') param2: string,
    @Param('filename') filename: string,
    @Response() res,
  ) {
    try {
      const { img, type } = await this.attachmentsService.fileRead({
        path: path.join(
          'nc',
          param1,
          param2,
          'uploads',
          ...filename.split('/'),
        ),
      });

      res.writeHead(200, { 'Content-Type': type });
      res.end(img, 'binary');
    } catch (e) {
      res.status(404).send('Not found');
    }
  }
}
