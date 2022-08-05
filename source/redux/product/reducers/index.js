const initialState = {
  load_category: false,
  load_product: false,
  list_category: [],
  list_product: [],
};

export default function reducer(state = initialState, action) {
  let index = action.payload;
  let products = [...state.list_product];

  switch (action.type) {
    case 'GET_CATEGORY_START':
      return { ...state, load_category: true };
    case 'GET_CATEGORY_SUCCESS':
      return {
        ...state,
        load_category: false,
        list_category: action.data,
      };
    case 'GET_CATEGORY_FAIL':
      return {
        ...state,
        load_category: false,
      };
    case 'GET_PRODUCT_START':
      return { ...state, load_product: true };
    case 'GET_PRODUCT_SUCCESS':
      return {
        ...state,
        load_product: false,
        list_product: action.data,
      };
    case 'GET_PRODUCT_FAIL':
      return {
        ...state,
        list_product: false,
      };
    case 'LIKE_PRODUCT':
      products[index] = {...products[index], like: true};
      return {
        ...state,
        list_product: products
      };
    case 'UNLIKE_PRODUCT':
      products[index] = {...products[index], like: false};
      return {
        ...state,
        list_product: products
      };
  }

  return state;
}
