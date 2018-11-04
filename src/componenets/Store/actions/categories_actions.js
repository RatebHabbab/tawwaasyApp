import {
    GET_CATEGORIES,
    GET_SUB_CATEGORIES,
    GET_CATEGORY_IMAGE
} from '../types';

import axios from 'axios';
import { APIURL, APPTOKEN } from '../../utils/misc';

export function getCategories(){
    const request = axios.get(`${APIURL}/V1/categories?searchCriteria`, {
        headers: { 
            Authorization: `Bearer ${APPTOKEN}` 
        }
    }).then(response =>response.data.children_data).catch(e=>{
        return false
    })
    return {
        type: GET_CATEGORIES,
        payload: request
    }
}

export function getSubCategories(id){
    const request = axios.get(`${APIURL}/V1/categories?searchCriteria`, {
        headers: { 
            Authorization: `Bearer ${APPTOKEN}` 
        }
    }).then(response =>response.data.children_data.children_data).catch(e=>{
        return false
    });
    return {
        type: GET_SUB_CATEGORIES,
        payload: request
    }
}

export function getCategoryImage(id){
    const request = axios.get(`${APIURL}/V1/categories/${id}?searchCriteria`, {
        headers: { 
            Authorization: `Bearer ${APPTOKEN}` 
        }
    }).then(response =>response.data.custom_attributes[0]['value']).catch(e=>{
        return false
    })
    return {
        type: GET_CATEGORY_IMAGE,
        payload: request
    }
}