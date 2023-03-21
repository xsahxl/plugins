import { Logger, getInputs, lodash } from '@serverless-cd/core';
import { stringify } from 'flatted';
import Checkout from './checkout';
import { IConfig } from './types';
import checkoutForAppCenter from './checkout-for-appcenter';
const debug = require('@serverless-cd/debug')('serverless-cd:checkout');

const { assign, get } = lodash;

export default async function checkout(config: IConfig) {
  await new Checkout(config).run();
}

export async function run(
  inputs: Record<string, any>,
  context: Record<string, any>,
  logger: Logger,
) {
  logger.info('Start checkout plugin');
  debug(`inputs: ${JSON.stringify(inputs, null, 2)}`);
  const newInputs = getInputs(inputs, context);
  debug(`getInputs: ${JSON.stringify(newInputs, null, 2)}`);

  const ctx = get(context, 'inputs.ctx.data.checkout');
  debug(`ctx.data.checkout: ${JSON.stringify(ctx, null, 2)}`);
  const newConfig = assign(
    {},
    {
      ...ctx,
      ...get(context, 'inputs.git'),
      logger,
    },
    newInputs,
  );
  debug(`newInputs: ${JSON.stringify(stringify(newConfig), null, 2)}`);
  debug(ctx ? 'appcenter checkout' : 'engine checkout');

  ctx
    ? await checkoutForAppCenter({
        ...newConfig,
        execDir: get(newConfig, 'execDir', get(context, 'cwd')),
      })
    : await new Checkout(newConfig).run();
  logger.info('End checkout plugin');
}
