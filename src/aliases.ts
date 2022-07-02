import moduleAlias from 'module-alias';
import path from 'path';

// This file is to make absolutee paths @app work.
const IS_DEV = process.env.NODE_ENV === 'development' || !__dirname.endsWith('lib');
const rootPath = path.resolve(__dirname, '..');
const rootPathDev = path.resolve(rootPath, 'src');
const rootPathProd = path.resolve(rootPath, 'lib');
moduleAlias.addAliases({
  '@app': IS_DEV ? rootPathDev : rootPathProd
});
