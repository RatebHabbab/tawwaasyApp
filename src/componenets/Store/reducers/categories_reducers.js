import {
    GET_CATEGORIES,
    GET_SUB_CATEGORIES,
    GET_CATEGORY_IMAGE
} from '../types';

export default function(state={},action){
    switch(action.type){
        case GET_CATEGORIES:
            return {...state, list:action.payload}
        case GET_SUB_CATEGORIES:
            return {...state, list: action.payload}
        case GET_CATEGORY_IMAGE:
            return {...state, image: action.payload}
        default:
            return state;
    }
}