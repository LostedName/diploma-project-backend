import { SecretsService } from '../../../shared/src/modules/secrets/secrets.service';

export default () => {
  return {
    envFilePath: [`.auth.env`],
    validate: SecretsService.secretsInjector,
  };
};
