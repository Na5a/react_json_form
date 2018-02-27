/**
 * Created by nasa on 3/8/16.
 */

import * as helper from "./../utils/helper";


const LOADING_AJAX = 'ajax/LOADING';
const LOAD_AJAX = 'ajax/LOAD';

const initialState = {
    loading: false,
    status:{fails:{}}
};

export default function reducer(state = initialState, action = {}) {
    let newstate = helper.assign(state);
    switch (action.type) {
        case LOADING_AJAX:
            //newstate.posts[action.post.id] = action.post;
            //return helper.assign(state,action);
            return {...newstate,...action};
        case LOAD_AJAX:
            //newstate.posts[action.post.id] = action.post;
            //return helper.assign(state,action);
            return {...newstate,...action};
        default:
            return state;
    }
}

export const load = (options={}) => {
    return Object.assign ({
        type: LOAD_AJAX,
        loading: false
    },options);
};
export const loading = () => {
    return {
        type: LOADING_AJAX,
        loading: true
    };
};
