import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
  Request,
  Body,
  Param,
} from '@nestjs/common';
import {
  Acl,
  ExtractProjectIdMiddleware,
} from '../../middlewares/extract-project-id/extract-project-id.middleware';
import { SharedBasesService } from './shared-bases.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
@UseGuards(ExtractProjectIdMiddleware, AuthGuard('jwt'))
export class SharedBasesController {
  constructor(private readonly sharedBasesService: SharedBasesService) {}

  @Post('/api/v1/db/meta/projects/:projectId/shared')
  @Acl('createSharedBaseLink')
  async createSharedBaseLink(
    @Request() req,
    @Body() body: any,
    @Param('projectId') projectId: string,
  ): Promise<any> {
    const sharedBase = await this.sharedBasesService.createSharedBaseLink({
      projectId: projectId,
      roles: body?.roles,
      password: body?.password,
      siteUrl: req.ncSiteUrl,
    });

    return sharedBase;
  }

  @Patch('/api/v1/db/meta/projects/:projectId/shared')
  @Acl('updateSharedBaseLink')
  async updateSharedBaseLink(
    @Request() req,
    @Body() body: any,
    @Param('projectId') projectId: string,
  ): Promise<any> {
    const sharedBase = await this.sharedBasesService.updateSharedBaseLink({
      projectId: projectId,
      roles: body?.roles,
      password: body?.password,
      siteUrl: req.ncSiteUrl,
    });

    return sharedBase;
  }

  @Delete('/api/v1/db/meta/projects/:projectId/shared')
  @Acl('disableSharedBaseLink')
  async disableSharedBaseLink(req, res): Promise<any> {
    const sharedBase = await this.sharedBasesService.disableSharedBaseLink({
      projectId: req.params.projectId,
    });

    res.json(sharedBase);
  }

  @Get('/api/v1/db/meta/projects/:projectId/shared')
  @Acl('getSharedBaseLink')
  async getSharedBaseLink(
    @Request() req,
    @Param('projectId') projectId: string,
  ): Promise<any> {
    const sharedBase = await this.sharedBasesService.getSharedBaseLink({
      projectId: projectId,
      siteUrl: req.ncSiteUrl,
    });

    return sharedBase;
  }
}
