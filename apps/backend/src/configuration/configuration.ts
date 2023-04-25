import { SecretsService } from '../../../shared/src/modules/secrets/secrets.service';

export default () => {
  return {
    envFilePath: [`.env`],
    validate: SecretsService.secretsInjector,
  };
};
