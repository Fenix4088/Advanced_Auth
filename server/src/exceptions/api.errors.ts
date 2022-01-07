export class ApiErrors extends Error {
  public status: number;
  public errors: any[];

  constructor(status: number, message: string, errors: any[] = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  public static UnauthorizedError = (message: string = 'User not authorized!') => {
    return new ApiErrors(401, message);
  };

  public static BadRequest = (message: string, errors: any[] = []) => {
    return new ApiErrors(400, message, errors);
  };
}
