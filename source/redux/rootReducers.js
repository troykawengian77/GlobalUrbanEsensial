import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProductReducer from './product/reducers/index';

const productPersistConfig = {
    key: 'product',
    storage: AsyncStorage,
};

const rootReducer = combineReducers({
    products: persistReducer(productPersistConfig, ProductReducer),
});

export default rootReducer;
