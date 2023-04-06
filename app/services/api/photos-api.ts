import {instance} from './api';

export const photosApi = {
  getPhotos(token: string, orderId: number) {
    return instance.get('/api/photos', {
      headers: {
        token: token,
        'Content-Type': 'multipart/form-data',
      },
      params: {
        orders_id: orderId,
      },
    });
  },
};
