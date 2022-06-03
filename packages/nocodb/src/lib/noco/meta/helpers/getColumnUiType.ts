import Base from '../../../models/Base';
import Column from '../../../models/Column';
import { ColumnType } from 'nocodb-sdk';
import ModelXcMetaFactory from '../../../sql-mgr/code/models/xc/ModelXcMetaFactory';

export default function getColumnUiType(
  base: Base,
  column: Column | ColumnType
) {
  const metaFact = ModelXcMetaFactory.create({ client: base.type }, {});
  return metaFact.getUIDataType(column);
}
