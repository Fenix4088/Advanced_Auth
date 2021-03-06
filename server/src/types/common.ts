import { Request } from 'express';
import { Types, Document } from 'mongoose';
import { FileArray } from 'express-fileupload';

export interface TypedRequestBody<T = any> extends Request {
  body: T;
}

export type TRequest<ReqParams, ReqBody, ReqQuery, WithFile = false> = Request<ReqParams, {}, ReqBody, ReqQuery> & WithFileType<WithFile>;

//TODO: try to redaclare original FileArray type and set there a strict strings as a keys
type WithFileType<C> = C extends true
  ? {
      files?: FileArray;
    }
  : {};

export type DocumentedObject<T> = Document<any, any, T> &
  T & {
    _id: Types.ObjectId;
  };

  export type RerquestExpressValidator<Body = any> = Request<Record<string, any> | undefined, any, Body, Record<string, any> | undefined, Record<string, any>>
