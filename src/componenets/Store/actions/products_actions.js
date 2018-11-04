import {
    GET_ALL_PRODUCTS,
    GET_PRODUCTS_BY_CATEGORY_ID
} from '../types';

import axios from 'axios';
import { APIURL, APPTOKEN } from '../../utils/misc';

export function getAllProducts(categoryId){
    let request = [];
    if(categoryId !== -1){
        request = axios.get(`${APIURL}/V1/products?searchCriteria[filterGroups][0][filters][0][field]=category_id& searchCriteria[filterGroups][0][filters][0][value]=${categoryId}`, {
            headers: { 
                Authorization: `Bearer ${APPTOKEN}` 
            }
        }).then(response =>response.data.items).catch(e=>{
            return false
        })
    } else {
        request = axios.get(`${APIURL}/V1/products?searchCriteria`, {
            headers: { 
                Authorization: `Bearer ${APPTOKEN}` 
            }
        }).then(response =>response.data.items).catch(e=>{
            return false
        })
    }
    return {
        type: GET_ALL_PRODUCTS,
        payload: request
    }
}

export function getProductsByCategoryId(categoryId){
    const request = axios.get(`${APIURL}/V1/categories/${categoryId}/products?searchCriteria`, {
        headers: { 
            Authorization: `Bearer ${APPTOKEN}` 
        }
    }).then(response =>response.data).catch(e=>{
        return false
    })
    return {
        type: GET_PRODUCTS_BY_CATEGORY_ID,
        payload: request
    }
}