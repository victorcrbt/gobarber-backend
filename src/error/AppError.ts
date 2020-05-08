interface ErrorProperties {
  message: string;
  status: number;
}

class AppError {
  public readonly status: number;

  public readonly message: string;

  constructor({ status = 400, message }: ErrorProperties) {
    this.message = message;
    this.status = status;
  }
}

export default AppError;
