/* eslint-disable */
import type { CallContext, CallOptions } from "nice-grpc-common";
import * as _m0 from "protobufjs/minimal";

export const protobufPackage = "chronicle";

export interface GetLogsRequest {
  containerId: string;
}

export interface GetLogsResponse {
  contents: string;
}

export interface LogMessage {
  contents: string;
}

function createBaseGetLogsRequest(): GetLogsRequest {
  return { containerId: "" };
}

export const GetLogsRequest = {
  encode(message: GetLogsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.containerId !== "") {
      writer.uint32(10).string(message.containerId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetLogsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetLogsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.containerId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetLogsRequest {
    return { containerId: isSet(object.containerId) ? String(object.containerId) : "" };
  },

  toJSON(message: GetLogsRequest): unknown {
    const obj: any = {};
    message.containerId !== undefined && (obj.containerId = message.containerId);
    return obj;
  },

  fromPartial(object: DeepPartial<GetLogsRequest>): GetLogsRequest {
    const message = createBaseGetLogsRequest();
    message.containerId = object.containerId ?? "";
    return message;
  },
};

function createBaseGetLogsResponse(): GetLogsResponse {
  return { contents: "" };
}

export const GetLogsResponse = {
  encode(message: GetLogsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.contents !== "") {
      writer.uint32(10).string(message.contents);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetLogsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetLogsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.contents = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetLogsResponse {
    return { contents: isSet(object.contents) ? String(object.contents) : "" };
  },

  toJSON(message: GetLogsResponse): unknown {
    const obj: any = {};
    message.contents !== undefined && (obj.contents = message.contents);
    return obj;
  },

  fromPartial(object: DeepPartial<GetLogsResponse>): GetLogsResponse {
    const message = createBaseGetLogsResponse();
    message.contents = object.contents ?? "";
    return message;
  },
};

function createBaseLogMessage(): LogMessage {
  return { contents: "" };
}

export const LogMessage = {
  encode(message: LogMessage, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.contents !== "") {
      writer.uint32(10).string(message.contents);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LogMessage {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLogMessage();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.contents = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LogMessage {
    return { contents: isSet(object.contents) ? String(object.contents) : "" };
  },

  toJSON(message: LogMessage): unknown {
    const obj: any = {};
    message.contents !== undefined && (obj.contents = message.contents);
    return obj;
  },

  fromPartial(object: DeepPartial<LogMessage>): LogMessage {
    const message = createBaseLogMessage();
    message.contents = object.contents ?? "";
    return message;
  },
};

export type LogServiceDefinition = typeof LogServiceDefinition;
export const LogServiceDefinition = {
  name: "LogService",
  fullName: "chronicle.LogService",
  methods: {
    getLogs: {
      name: "GetLogs",
      requestType: GetLogsRequest,
      requestStream: false,
      responseType: GetLogsResponse,
      responseStream: false,
      options: {},
    },
    streamLogs: {
      name: "StreamLogs",
      requestType: GetLogsRequest,
      requestStream: false,
      responseType: LogMessage,
      responseStream: true,
      options: {},
    },
  },
} as const;

export interface LogServiceImplementation<CallContextExt = {}> {
  getLogs(request: GetLogsRequest, context: CallContext & CallContextExt): Promise<DeepPartial<GetLogsResponse>>;
  streamLogs(
    request: GetLogsRequest,
    context: CallContext & CallContextExt,
  ): ServerStreamingMethodResult<DeepPartial<LogMessage>>;
}

export interface LogServiceClient<CallOptionsExt = {}> {
  getLogs(request: DeepPartial<GetLogsRequest>, options?: CallOptions & CallOptionsExt): Promise<GetLogsResponse>;
  streamLogs(request: DeepPartial<GetLogsRequest>, options?: CallOptions & CallOptionsExt): AsyncIterable<LogMessage>;
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export type ServerStreamingMethodResult<Response> = { [Symbol.asyncIterator](): AsyncIterator<Response, void> };
