import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PagedResponseImpl } from '../../helpers/PagedResponse';
import {
  Acl,
  ExtractProjectIdMiddleware,
} from '../../middlewares/extract-project-id/extract-project-id.middleware';
import { Audit } from '../../models';
import { AuditsService } from './audits.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
@UseGuards(ExtractProjectIdMiddleware, AuthGuard('jwt'))
export class AuditsController {
  constructor(private readonly auditsService: AuditsService) {}

  @Post('/api/v1/db/meta/audits/comments')
  @Acl('commentRow')
  async commentRow(@Request() req) {
    return await this.auditsService.commentRow({
      // todo: correct this
      rowId: req.params.rowId ?? req.query.rowId,
      user: (req as any).user,
      body: req.body,
    });
  }

  @Post('/api/v1/db/meta/audits/rows/:rowId/update')
  @Acl('auditRowUpdate')
  async auditRowUpdate(@Param('rowId') rowId: string, @Body() body: any) {
    return await this.auditsService.auditRowUpdate({
      rowId,
      body,
    });
  }

  @Get('/api/v1/db/meta/audits/comments')
  @Acl('commentList')
  async commentList(@Request() req) {
    return new PagedResponseImpl(
      await this.auditsService.commentList({ query: req.query }),
    );
  }

  @Patch('/api/v1/db/meta/audits/:auditId/comment')
  @Acl('commentUpdate')
  async commentUpdate(
    @Param('auditId') auditId: string,
    @Request() req,
    @Body() body: any,
  ) {
    return await this.auditsService.commentUpdate({
      auditId,
      userEmail: req.user?.email,
      body: body,
    });
  }

  @Get('/api/v1/db/meta/projects/:projectId/audits')
  @Acl('auditList')
  async auditList(@Request() req, @Param('projectId') projectId: string) {
    return new PagedResponseImpl(
      await this.auditsService.auditList({
        query: req.query,
        projectId,
      }),
      {
        count: await Audit.projectAuditCount(projectId),
        ...req.query,
      },
    );
  }

  @Get('/api/v1/db/meta/audits/comments/count')
  @Acl('commentsCount')
  async commentsCount(
    @Query('fk_model_id') fk_model_id: string,
    @Query('ids') ids: string[],
  ) {
    return await this.auditsService.commentsCount({
      fk_model_id,
      ids,
    });
  }
}
