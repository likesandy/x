import XStream from '../x-stream';
import xFetch from './x-fetch';

import type { SSEOutput, XReadableStream, XStreamOptions } from '../x-stream';
import type { XFetchMiddlewares, XFetchOptions } from './x-fetch';

import type { AnyObject } from '../_util/type';

export interface XRequestCallbacks<Output> {
  /**
   * @description Callback when the request is successful
   */
  onSuccess: (chunks: Output[]) => void;

  /**
   * @description Callback when the request fails
   */
  onError: (error: Error) => void;

  /**
   * @description Callback when the request is updated
   */
  onUpdate: (chunk: Output) => void;
}

export interface XRequestOptions<Input = AnyObject, Output = SSEOutput> {
  /**
   * @description Callbacks for the request
   */
  callbacks?: XRequestCallbacks<Output>;
  /**
   * @description The parameters to be sent
   */
  params?: Input;
  /**
   * @description The custom headers to be sent
   */
  headers?: Record<string, string>;
  /**
   * @description The timeout for the request
   */
  timeout?: number;
  /**
   * @description The timeout for the stream mode request,when the stream mode request is timeout, the request will be aborted
   */
  streamTimeout?: number;
  /**
   * @description Custom fetch
   */
  fetch?: XFetchOptions['fetch'];
  /**
   * @description Middlewares for the request and response
   */
  middlewares?: XFetchMiddlewares;
  /**
   * @description Custom stream transformer, can use to adapt the stream data to the custom format
   */
  transformStream?: XStreamOptions<Output>['transformStream'];
}

export type XRequestGlobalOptions<Input, Output> = Pick<
  XRequestOptions<Input, Output>,
  'headers' | 'timeout' | 'streamTimeout' | 'middlewares' | 'fetch' | 'transformStream'
>;

/**
 * @description Global options for the request
 */
const globalOptions: XRequestGlobalOptions<AnyObject, AnyObject> = {
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * Set global options for the request
 * @param options XRequestGlobalOptions<Input, Output>
 */
export function setXRequestGlobalOptions<Input, Output>(
  options: XRequestGlobalOptions<Input, Output>,
) {
  Object.assign(globalOptions, options);
}

export class XRequestClass<Input = AnyObject, Output = SSEOutput> {
  readonly baseURL: string;
  private options: XRequestOptions<Input, Output>;

  private timeoutHandler!: number;
  private _isTimeout = false;
  private streamTimeoutHandler!: number;
  private _isStreamTimeout = false;
  private abortController!: AbortController;

  public get isTimeout() {
    return this._isTimeout;
  }

  private set isTimeout(value: boolean) {
    this._isTimeout = value;
  }

  public get isStreamTimeout() {
    return this._isStreamTimeout;
  }

  private set isStreamTimeout(value: boolean) {
    this._isStreamTimeout = value;
  }

  constructor(baseURL: string, options: XRequestOptions<Input, Output>) {
    this.baseURL = baseURL;
    this.options = options || {};
    this.init();
  }

  public abort() {
    clearTimeout(this.timeoutHandler);
    clearTimeout(this.streamTimeoutHandler);
    this.abortController.abort();
  }

  private init() {
    const abortController = new AbortController();
    const {
      callbacks,
      params = {},
      headers = {},
      transformStream,
      fetch,
      timeout,
      streamTimeout,
    } = this.options;
    const requestInit = {
      method: 'POST',
      body: JSON.stringify({
        ...params,
      }),
      headers: Object.assign({}, globalOptions.headers || {}, headers),
      signal: abortController.signal,
    };
    if (timeout && timeout > 0) {
      this.timeoutHandler = window.setTimeout(() => {
        this.isTimeout = true;
        callbacks?.onError?.(new Error('Request timeout!'));
      }, timeout);
    }
    xFetch(this.baseURL, {
      fetch,
      ...requestInit,
    })
      .then((response) => {
        clearTimeout(this.timeoutHandler);
        if (this.isTimeout) return;

        if (transformStream) {
          this.customResponseHandler<Output>(response, callbacks, transformStream, streamTimeout);
          return;
        }
        const contentType = response.headers.get('content-type') || '';
        const mimeType = contentType.split(';')[0].trim();
        switch (mimeType) {
          /** SSE */
          case 'text/event-stream':
            this.sseResponseHandler<Output>(response, callbacks, streamTimeout);
            break;
          /** JSON */
          case 'application/json':
            this.jsonResponseHandler<Output>(response, callbacks);
            break;
          default:
            throw new Error(`The response content-type: ${contentType} is not support!`);
        }
      })
      .catch((error) => {
        clearTimeout(this.timeoutHandler);
        const err = error instanceof Error ? error : new Error('Unknown error!');
        callbacks?.onError?.(err);
        throw err;
      });
  }

  private customResponseHandler = async <Output = SSEOutput>(
    response: Response,
    callbacks?: XRequestCallbacks<Output>,
    transformStream?: XStreamOptions<Output>['transformStream'],
    streamTimeout?: number | undefined,
  ) => {
    const stream = XStream<Output>({
      readableStream: response.body!,
      transformStream,
    });
    this.processStream<Output>(stream, callbacks, streamTimeout);
  };

  private sseResponseHandler = async <Output = SSEOutput>(
    response: Response,
    callbacks?: XRequestCallbacks<Output>,
    streamTimeout?: number,
  ) => {
    const stream = XStream<Output>({
      readableStream: response.body!,
    });
    this.processStream(stream, callbacks, streamTimeout);
  };

  private async processStream<Output>(
    stream: XReadableStream<Output>,
    callbacks?: XRequestCallbacks<Output>,
    streamTimeout?: number,
  ) {
    const chunks: Output[] = [];
    const iterator = stream[Symbol.asyncIterator]();
    // if streamTimeout is set, start the timeout timer
    if (streamTimeout) {
      this.streamTimeoutHandler = window.setTimeout(() => {
        this.isStreamTimeout = true;
        callbacks?.onError?.(new Error('Request stream timeout!'));
      }, streamTimeout);
    }
    let result = await iterator.next();
    while (!result.done) {
      if (streamTimeout) {
        clearTimeout(this.streamTimeoutHandler);
        if (this.isStreamTimeout) return;
      }
      chunks.push(result.value);
      callbacks?.onUpdate?.(result.value);
      if (streamTimeout) {
        this.streamTimeoutHandler = window.setTimeout(() => {
          this.isStreamTimeout = true;
          callbacks?.onError?.(new Error('Request stream timeout!'));
        }, streamTimeout);
      }
      result = await iterator.next();
    }
    if (streamTimeout) {
      clearTimeout(this.streamTimeoutHandler);
      if (this.isStreamTimeout) return;
    }
    callbacks?.onSuccess?.(chunks);
  }

  private jsonResponseHandler = async <Output = SSEOutput>(
    response: Response,
    callbacks?: XRequestCallbacks<Output>,
  ) => {
    const chunk: Output = await response.json();
    callbacks?.onUpdate?.(chunk);
    callbacks?.onSuccess?.([chunk]);
  };
}

const XRequest = (baseURL: string, options: XRequestOptions) => {
  return new XRequestClass(baseURL, options);
};

export default XRequest;
