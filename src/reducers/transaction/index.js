import {
  GET_LIST_TRANSACTION,
  SAVE_KEYWORD_TRANSACTION,
  GET_LIST_TRANSACTION_USER,
} from "../../action/TransactionAction.js";

const initialState = {
  getListTransactionLoading: false,
  getListTransactionResult: false,
  getListTransactionError: false,

  keyword: false,

  getListTransactionUserLoading: false,
  getListTransactionUserResult: false,
  getListTransactionUserError: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_LIST_TRANSACTION:
      return {
        ...state,
        getListTransactionLoading: action.payload.loading,
        getListTransactionResult: action.payload.data,
        getListTransactionError: action.payload.errorMessage,
      };
    case SAVE_KEYWORD_TRANSACTION:
      return {
        ...state,
        keyword: action.payload.keyword,
      };
    case GET_LIST_TRANSACTION_USER:
      return {
        ...state,
        getListTransactionUserLoading: action.payload.loading,
        getListTransactionUserResult: action.payload.data,
        getListTransactionUserError: action.payload.errorMessage,
      };
    default:
      return state;
  }
}
