import { getReasonPhrase } from 'http-status-codes';

class ApiError extends Error {

  private _status: number;

  constructor(status: number, message?: string) 
  {
    super();
    this.message = message || getReasonPhrase(status) || 'unknown';
    this._status = status;
  }

  set status(_status: number)
  { 
    // Do nothing.
  };

  get status() {
    return this._status;
  }

}

export default ApiError;