import { upperFirst } from 'lodash';

const requestOption = {
  method: 'POST',
  formatParams: false,
};

function validateObjectType(objectType?: string) {
  const enumList = ['File', 'Directory', 'Regex'];
  if (objectType) {
    return enumList.indexOf(objectType) >= 0;
  } else {
    // 允许为空
    return true;
  }
}

function getObjectPath(objectPath: string | Array<string>) {
  return Array.isArray(objectPath) ? objectPath.join('\n') : objectPath;
}
function isPush(arg: any): arg is IRefresh {
  return arg.operateType === 'push';
}

interface IRefresh {
  operateType: string;
  objectPath: string | Array<string>;
  objectType?: 'File' | 'Directory' | 'Regex';
}

interface IPush {
  operateType: string;
  objectPath: string | Array<string>;
  area?: string;
}

interface IConfig {
  logger: any;
  client: any;
  params: IRefresh | IPush;
}

class Service {
  private logger: any;
  private client: any;
  private params: IRefresh | IPush;

  constructor(private config: IConfig) {
    this.logger = config.logger || console;
    this.client = config.client;
    this.params = config.params;
  }

  async refreshObjectCaches(params: IRefresh) {
    const { objectType, objectPath } = params;

    if (!validateObjectType(objectType)) {
      throw new Error('objectPath 参数填写不正确，为下面三者其一：File,Directory,Regex');
    }
    // 刷新
    await this.client.request(
      'RefreshObjectCaches',
      {
        ObjectPath: getObjectPath(objectPath),
        ObjectType: !objectType ? 'File' : upperFirst(objectType),
      },
      requestOption,
    );
  }

  async pushObjectCache(params: IPush) {
    const { objectPath, area } = params;
    // Area
    const requestOption = {
      method: 'POST',
      formatParams: false,
    };
    // 刷新
    await this.client.request(
      'PushObjectCache',
      {
        ObjectPath: getObjectPath(objectPath),
        /**
         * 预热区域。取值：
            domestic：仅中国内地。
            overseas：全球（不包含中国内地）。
            如果不传该参数，默认的预热区域为您的域名所配置的CDN加速区域。具体如下：
  
            域名的加速区域为“仅中国内地”，预热区域是仅中国内地。
            域名的加速区域为“全球”，预热区域是全球。
            域名的加速区域为“全球（不包含中国内地）”，预热区域是全球（不包含中国内地）。
         */
        Area: area,
      },
      requestOption,
    );
  }

  async pushOrRefreshCache() {
    if (isPush(this.params)) {
      this.logger.info('CND 缓存开始预热');
      await this.pushObjectCache(this.params);
      this.logger.info('CND 缓存预热完成！');
    } else {
      this.logger.info('CND 缓存开始刷新');
      await this.refreshObjectCaches(this.params);
      this.logger.info('CND 缓存刷新完成！');
    }
  }
}

export default Service;
