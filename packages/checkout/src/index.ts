import { Logger, getInputs, lodash } from '@serverless-cd/core';
import Checkout from './checkout';
import { IConfig } from './types';

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
  logger.info(`inputs: ${JSON.stringify(inputs, null, 2)}`);
  const newInputs = getInputs(inputs, context);
  const newConfig = assign(
    {},
    {
      ...get(context, 'inputs.ctx.data.checkout'),
      ...get(context, 'inputs.git'),
      logger,
    },
    newInputs,
  );
  logger.info(`newInputs: ${JSON.stringify(newConfig, null, 2)}`);
  await new Checkout(newConfig).run();
  logger.info('End checkout plugin');
}
