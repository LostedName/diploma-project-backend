export class SecretsService {
  private static instance = new SecretsService();
  private secretPlaceholderRegExt = new RegExp('{{(.*)}}');

  static secretsInjector(config: Record<string, any>): Record<string, any> {
    return SecretsService.instance.injectSecrets(config);
  }

  injectSecrets(config: Record<string, any>): Record<string, any> {
    const keys = Object.keys(config);
    const result: any = {};
    for (const key of keys) {
      const value = config[key];
      result[key] = this.injectIntoValue(value);
    }

    return result;
  }

  private injectIntoValue(value: any): any {
    if (value! instanceof String) {
      return value;
    }

    const resultValue = value.replace(
      this.secretPlaceholderRegExt,
      (match, name) => {
        const secret = this.getSecrete(name);
        if (secret === undefined) {
          console.log('!!!Error. Could not resolve secret', name);
          return '';
        }

        return secret;
      },
    );

    return resultValue;
  }

  private getSecrete(name: string): any | undefined {
    try {
      const value = process.env[name];
      return value;
    } catch (e) {
      return undefined;
    }
  }
}
