import {
  GET_LIST_USER_TOTAL,
  GET_LIST_QUOTES,
  ORDER_TODAY,
  MONEY_TODAY,
  SALES_THIS_MONTH,
  SALES_SIX_MONTH,
} from "../../action/DashboardAction";

const initialState = {
  listUserTotalLoading: false,
  listUserTotalResult: false,
  listUserTotalError: false,

  listQuotesLoading: false,
  listQuotesResult: false,
  listQuotesError: false,

  orderTodayLoading: false,
  orderTodayResult: false,
  orderTodayError: false,

  moneyTodayLoading: false,
  moneyTodayResult: false,
  moneyTodayError: false,

  salesThisMonthLoading: false,
  salesThisMonthResult: false,
  salesThisMonthError: false,

  salesSixMonthLoading: false,
  salesSixMonthResult: false,
  salesSixMonthError: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_LIST_USER_TOTAL:
      return {
        ...state,
        listUserTotalLoading: action.payload.loading,
        listUserTotalResult: action.payload.data,
        listUserTotalError: action.payload.errorMessage,
      };
    case GET_LIST_QUOTES:
      return {
        ...state,
        listQuotesLoading: action.payload.loading,
        listQuotesResult: action.payload.data,
        listQuotesError: action.payload.errorMessage,
      };
    case ORDER_TODAY:
      return {
        ...state,
        orderTodayLoading: action.payload.loading,
        orderTodayResult: action.payload.data,
        orderTodayError: action.payload.errorMessage,
      };
    case MONEY_TODAY:
      return {
        ...state,
        moneyTodayLoading: action.payload.loading,
        moneyTodayResult: action.payload.data,
        moneyTodayError: action.payload.errorMessage,
      };
    case SALES_THIS_MONTH:
      return {
        ...state,
        salesThisMonthLoading: action.payload.loading,
        salesThisMonthResult: action.payload.data,
        salesThisMonthError: action.payload.errorMessage,
      };
    case SALES_SIX_MONTH:
      return {
        ...state,
        salesSixMonthLoading: action.payload.loading,
        salesSixMonthResult: action.payload.data,
        salesSixMonthError: action.payload.errorMessage,
      };
    default:
      return state;
  }
}
