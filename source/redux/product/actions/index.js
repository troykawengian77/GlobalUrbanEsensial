import { API } from '../../api';

export const getCategoryProduct = () => {
  return async dispatch => {
    const { request } = API();
    dispatch({ type: 'GET_CATEGORY_START' });
    try {
      const resp = await request.get(`e05f5d45-37b9-45ab-8611-8a9f2ffa6ee2`);
      const data = resp.data.data

      dispatch({
        type: 'GET_CATEGORY_SUCCESS',
        data: data
      });
      return data;
    } catch (err) {
      dispatch({type: 'GET_CATEGORY_FAIL'});
      console.log(err)
    }
  };
};

export const getProduct = () => {
  return async dispatch => {
    const { request } = API();
    dispatch({ type: 'GET_PRODUCT_START' });
    try {
      const resp = await request.get(`f7b172cf-eb64-471b-b2d3-2876e00805a8`);
      const data = resp.data.data

      dispatch({
        type: 'GET_PRODUCT_SUCCESS',
        data: data
      });
      return data;
    } catch (err) {
      dispatch({type: 'GET_PRODUCT_FAIL'});
      console.log(err)
    }
  };
};

export const likeProduct = (id) => {
  return async dispatch => {
    try {
      dispatch({
        type: 'LIKE_PRODUCT',
        payload: id
      });
    } catch (err) {
      console.log(err)
    }
  };
};

export const unlikeProduct = (id) => {
  return async dispatch => {
    try {
      dispatch({
        type: 'UNLIKE_PRODUCT',
        payload: id
      });
    } catch (err) {
      console.log(err)
    }
  };
};
