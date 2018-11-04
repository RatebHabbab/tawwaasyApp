import {
    GET_ALL_PRODUCTS,
    GET_PRODUCTS_BY_CATEGORY_ID
} from '../types';

export default function(state={},action){
    switch(action.type){
        case GET_ALL_PRODUCTS:
            return {...state, list:action.payload}
        case GET_PRODUCTS_BY_CATEGORY_ID:
            return {...state, list:action.payload}
        default:
            return state;
    }
}