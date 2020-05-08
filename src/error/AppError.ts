interface ErrorProperties {
  message: string;
  status: number;
}

class AppError extends Error {
  public readonly status: number;

  public readonly message: string;

  constructor({ status = 400, message }: ErrorProperties) {
    super();
    this.message = message;
    this.status = status;
  }
}

export default AppError;
