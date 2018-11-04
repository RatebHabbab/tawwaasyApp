import { combineReducers } from 'redux';
import Categories from './categories_reducers';
import Products from './products_reducer';

const rootReducer = combineReducers({
    Categories,
    Products,
})

export default rootReducer;