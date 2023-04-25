import { AppError, ErrorReason } from './app-errors';

export class ApiErrorRenderer {
  renderError(error: AppError): object {
    const errorObject: any = {
      code: error.code,
      description: error.description,
    };

    if (error.extra) {
      errorObject.extra = error.extra;
    }

    if (error.reasons && error.reasons.length > 0) {
      errorObject.reasons = error.reasons.map((reason) => {
        return this.renderReason(reason);
      });
    }

    return { error: errorObject };
  }

  private renderReason(reason: ErrorReason): object {
    const reasonObject: any = {
      code: reason.code,
      description: reason.description,
    };

    if (reason.extra) {
      reasonObject.extra = reason.extra;
    }

    return reasonObject;
  }
}
