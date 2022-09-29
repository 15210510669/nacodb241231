// // Project CRUD
import { Request, Response } from 'express';

import { packageVersion } from 'nc-help';
import ncMetaAclMw from '../helpers/ncMetaAclMw';
import SqlMgrv2 from '../../db/sql-mgr/v2/SqlMgrv2';
import NcConfigFactory, {
  defaultConnectionConfig,
} from '../../utils/NcConfigFactory';
import User from '../../models/User';
import catchError from '../helpers/catchError';
import axios from 'axios';

const versionCache = {
  releaseVersion: null,
  lastFetched: null,
};

export async function testConnection(req: Request, res: Response) {
  res.json(await SqlMgrv2.testConnection(req.body));
}
export async function appInfo(req: Request, res: Response) {
  const projectHasAdmin = !(await User.isFirst());
  const result = {
    authType: 'jwt',
    projectHasAdmin,
    firstUser: !projectHasAdmin,
    type: 'rest',
    env: process.env.NODE_ENV,
    googleAuthEnabled: !!(
      process.env.NC_GOOGLE_CLIENT_ID && process.env.NC_GOOGLE_CLIENT_SECRET
    ),
    githubAuthEnabled: !!(
      process.env.NC_GITHUB_CLIENT_ID && process.env.NC_GITHUB_CLIENT_SECRET
    ),
    oneClick: !!process.env.NC_ONE_CLICK,
    connectToExternalDB: !process.env.NC_CONNECT_TO_EXTERNAL_DB_DISABLED,
    canCreateProjectWithoutExternalDB:
      !process.env.NC_PROJECT_WITHOUT_EXTERNAL_DB_DISABLED,
    useFinnTheme: !!process.env.NC_USE_FINN,
    version: packageVersion,
    defaultLimit: Math.max(
      Math.min(
        +process.env.DB_QUERY_LIMIT_DEFAULT || 25,
        +process.env.DB_QUERY_LIMIT_MAX || 100
      ),
      +process.env.DB_QUERY_LIMIT_MIN || 1
    ),
    timezone: defaultConnectionConfig.timezone,
    ncMin: !!process.env.NC_MIN,
    teleEnabled: !process.env.NC_DISABLE_TELE,
    noSignUp: process.env.NC_NO_SIGN_UP === '1',
    ncSiteUrl: (req as any).ncSiteUrl,
  };

  res.json(result);
}

export async function versionInfo(_req: Request, res: Response) {
  if (
    !versionCache.lastFetched ||
    (versionCache.lastFetched &&
      versionCache.lastFetched < Date.now() - 1000 * 60 * 60)
  ) {
    versionCache.releaseVersion = await axios
      .get('https://github.com/nocodb/nocodb/releases/latest', {
        timeout: 5000,
      })
      .then((response) =>
        response.request.res.responseUrl.replace(
          'https://github.com/nocodb/nocodb/releases/tag/',
          ''
        )
      )
      .catch(() => null);
    versionCache.lastFetched = Date.now();
  }

  const response = {
    currentVersion: packageVersion,
    releaseVersion: versionCache.releaseVersion,
  };

  res.json(response);
}

export async function feedbackFormGet(_req: Request, res: Response) {
  axios
    .get('https://nocodb.com/api/v1/feedback_form', {
      timeout: 5000,
    })
    .then((response) => {
      res.json(response.data);
    })
    .catch((e) => {
      res.json({ error: e.message });
    });
}

export async function appHealth(_: Request, res: Response) {
  res.json({
    message: 'OK',
    timestamp: Date.now(),
    uptime: process.uptime(),
  });
}

async function _axiosRequestMake(req: Request, res: Response) {
  const { apiMeta } = req.body;

  if (apiMeta?.body) {
    try {
      apiMeta.body = JSON.parse(apiMeta.body);
    } catch (e) {
      console.log(e);
    }
  }

  if (apiMeta?.auth) {
    try {
      apiMeta.auth = JSON.parse(apiMeta.auth);
    } catch (e) {
      console.log(e);
    }
  }

  apiMeta.response = {};
  const _req = {
    params: apiMeta.parameters
      ? apiMeta.parameters.reduce((paramsObj, param) => {
          if (param.name && param.enabled) {
            paramsObj[param.name] = param.value;
          }
          return paramsObj;
        }, {})
      : {},
    url: apiMeta.url,
    method: apiMeta.method || 'GET',
    data: apiMeta.body || {},
    headers: apiMeta.headers
      ? apiMeta.headers.reduce((headersObj, header) => {
          if (header.name && header.enabled) {
            headersObj[header.name] = header.value;
          }
          return headersObj;
        }, {})
      : {},
    responseType: apiMeta.responseType || 'json',
    withCredentials: true,
  };
  const data = await require('axios')(_req);
  return res.json(data?.data);
}

export async function axiosRequestMake(req: Request, res: Response) {
  const {
    apiMeta: { url },
  } = req.body;
  const isExcelImport = /.*\.(xls|xlsx|xlsm|ods|ots)/;
  const isCSVImport = /.*\.(csv)/;
  const ipBlockList =
    /(10)(\.([2]([0-5][0-5]|[01234][6-9])|[1][0-9][0-9]|[1-9][0-9]|[0-9])){3}|(172)\.(1[6-9]|2[0-9]|3[0-1])(\.(2[0-4][0-9]|25[0-5]|[1][0-9][0-9]|[1-9][0-9]|[0-9])){2}|(192)\.(168)(\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])){2}|(0.0.0.0)|localhost?/g;
  if (
    ipBlockList.test(url) ||
    (!isCSVImport.test(url) && !isExcelImport.test(url))
  ) {
    return res.json({});
  }
  if (isCSVImport || isExcelImport) {
    req.body.apiMeta.responseType = 'arraybuffer';
  }
  return await _axiosRequestMake(req, res);
}

export async function urlToDbConfig(req: Request, res: Response) {
  const { url } = req.body;
  try {
    let connectionConfig;
    connectionConfig = NcConfigFactory.extractXcUrlFromJdbc(url, true);
    return res.json(connectionConfig);
  } catch (error) {
    return res.sendStatus(500);
  }
}

export default (router) => {
  router.post(
    '/api/v1/db/meta/connection/test',
    ncMetaAclMw(testConnection, 'testConnection')
  );
  router.get('/api/v1/db/meta/nocodb/info', catchError(appInfo));
  router.post('/api/v1/db/meta/axiosRequestMake', catchError(axiosRequestMake));
  router.get('/api/v1/version', catchError(versionInfo));
  router.get('/api/v1/health', catchError(appHealth));
  router.get('/api/v1/feedback_form', catchError(feedbackFormGet));
  router.post('/api/v1/url_to_config', catchError(urlToDbConfig));
};
