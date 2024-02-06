import { GET_LIST_FIELDS } from "../../action/FieldAction";

const initialState = {
  listFieldsLoading: false,
  listFieldsResult: false,
  listFieldsError: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_LIST_FIELDS:
      return {
        ...state,
        listFieldsLoading: action.payload.loading,
        listFieldsResult: action.payload.data,
        listFieldsError: action.payload.errorMessage,
      };

    default:
      return state;
  }
}
