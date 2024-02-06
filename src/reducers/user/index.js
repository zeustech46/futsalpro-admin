import { GET_DETAIL_USER, GET_LIST_USER } from "../../action/UserAction";

const initialState = {
  getDetailUserLoading: false,
  getDetailUserResult: false,
  getDetailUserError: false,

  getListUserLoading: false,
  getListUserResult: false,
  getListUserError: false,

  keyword: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_DETAIL_USER:
      return {
        ...state,
        getDetailUserLoading: action.payload.loading,
        getDetailUserResult: action.payload.data,
        getDetailUserError: action.payload.errorMessage,
      };
    case GET_LIST_USER:
      return {
        ...state,
        getListUserLoading: action.payload.loading,
        getListUserResult: action.payload.data,
        getListUserError: action.payload.errorMessage,
      };
    default:
      return state;
  }
}
