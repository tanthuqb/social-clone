import { BaseProvider } from "./provider";

export enum ResponseStatus {
  Success = 200,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  Forbidden = 403,
  MethodNotAllowed = 405,
  NotAcceptable = 406,
  RequestTimeout = 408,
  Conflict = 409,
  Gone = 410,
  PreconditionFailed = 412,
  PayloadTooLarge = 413,
  UnsupportedMediaType = 415,
  ImATeapot = 418,
  UnprocessableEntity = 422,
  InternalServerError = 500,
  NotImplemented = 501,
  BadGateway = 502,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
  HttpVersionNotSupported = 505,
}

export interface ControllerResponse<T> {
  status: ResponseStatus;
  result?: T | undefined | null;
  message?: string | undefined;
}

export interface PaginationQuery {
  currentPage: number;
  lastPage: number;
  total: number;
  limit: number;
}

export interface PaginationType<T> {
  results: T[];
  pagination: PaginationQuery;
}

export class BaseController<T extends BaseProvider> {
  protected provider: T;

  constructor(provider?: T) {
    if (!provider) {
      throw Error("PROVIDER_NOT_INJECT: " + this.constructor.name);
    }
    this.provider = provider;
  }
}
