import axios from 'axios';
import ApiException from './ApiException';

export const userService = {

  getUserUri(endpoint) {
    return 'http://127.0.0.1:3001'.concat(endpoint);
  },

  createUser(name) {
    return new Promise((resolve, reject) => {
      if (name) {
        const uri = userService.getUserUri('/users');
        return axios.post(uri, { name })
          .then(response => resolve(response.data))
          .catch(err => {
            if (err.toString().includes('Network Error')) {
              return reject(new ApiException(null, 'network.error'));
            }
            reject(ApiException.fromAxios(err));
          });
      }
      return reject(new ApiException(400, 'empty.name'));
    });
  },

  removeUser(userId, userToken) {
    return new Promise((resolve, reject) => {
      if (!isNaN(userId) && userToken) {
        const axiosInstance = axios.create({
          headers: { 'Authorization': userToken }
        });
        return axiosInstance.delete(userService.getUserUri('/me'))
          .then(() => resolve())
          .catch(err => {
            if (err.toString().includes('Network Error')) {
              return reject(new ApiException(null, 'network.error'));
            }
            reject(ApiException.fromAxios(err));
          });
      }
      return reject(new ApiException(400, 'wrong.id.or.empty.token'));
    });
  },

  fetchUser(userId, userToken) {
    return new Promise((resolve, reject) => {
      if (!isNaN(userId) && userToken) {
        const axiosInstance = axios.create({
          headers: { 'Authorization': userToken }
        });
        return axiosInstance.get(userService.getUserUri('/me'))
          .then(response => resolve(response.data))
          .catch(err => {
            if (err.toString().includes('Network Error')) {
              return reject(new ApiException(null, 'network.error'));
            }
            reject(ApiException.fromAxios(err));
          });
      }
      return reject(new ApiException(400, 'wrong.id.or.empty.token'));
    });
  }

}
