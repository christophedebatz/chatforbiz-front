export default class ApiException {

  static fromAxios(axiosError) {
    if (axiosError && axiosError.response) {
      return new ApiException(
        axiosError.response.status || 500,
        axiosError.response.data.error || 'unexpected.error'
      );
    }
    throw new Error('Unable to parse Axios response.');
  }

  constructor(status, code) {
    this.status = status;
    this.code = code;
  }

  getStatus() {
    return this.status;
  }

  getCode() {
    return this.code;
  }

}
