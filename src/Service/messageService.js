import axios from 'axios';
import ApiException from './ApiException';

export const messageService = {

  getUserUri(endpoint) {
    return 'http://127.0.0.1:3001'.concat(endpoint);
  },

  fetchLastMessages(userToken) {
    return new Promise((resolve, reject) => {
      if (userToken) {
        const axiosInstance = axios.create({
          headers: { 'Authorization': userToken }
        });
        return axiosInstance.get(messageService.getUserUri('/messages'))
          .then(response => resolve(response.data))
          .catch(err => messageService.rejectError(err, reject));
      }
      return reject(new ApiException(400, 'empty.token'));
    });
  },

  rejectError(err, reject) {
    if (err.toString().includes('Network Error')) {
      return reject(new ApiException(null, 'network.error'));
    }
    reject(ApiException.fromAxios(err));
  }
}
