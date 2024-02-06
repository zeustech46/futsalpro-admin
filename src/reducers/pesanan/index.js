import {
  CHECK_SCHEDULE,
  CHECK_PESANAN,
  CHECK_PESANAN_RANGE_DATE,
  UPDATE_PESANAN,
  DELETE_PESANAN,
  CANCEL_PESANAN,
  UPDATE_PESANAN_TRANSACTION,
} from "../../action/PesananAction";

const initialState = {
  checkScheduleLoading: false,
  checkScheduleResult: false,
  checkScheduleError: false,

  checkScheduleLoading: false,
  checkScheduleResult: false,
  checkScheduleError: false,

  checkPesananRangeDateLoading: false,
  checkPesananRangeDateResult: false,
  checkPesananRangeDateError: false,

  updatePesananLoading: false,
  updatePesananResult: false,
  updatePesananError: false,

  deletePesananLoading: false,
  deletePesananResult: false,
  deletePesananError: false,

  cancelPesananLoading: false,
  cancelPesananResult: false,
  cancelPesananError: false,

  updatePesananTransactionLoading: false,
  updatePesananTransactionResult: false,
  updatePesananTransactionError: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CHECK_SCHEDULE:
      return {
        ...state,
        checkScheduleLoading: action.payload.loading,
        checkScheduleResult: action.payload.data,
        checkScheduleError: action.payload.errorMessage,
      };
    case CHECK_PESANAN:
      return {
        ...state,
        checkPesananLoading: action.payload.loading,
        checkPesananResult: action.payload.data,
        checkPesananError: action.payload.errorMessage,
      };
    case CHECK_PESANAN_RANGE_DATE:
      return {
        ...state,
        checkPesananRangeDateLoading: action.payload.loading,
        checkPesananRangeDateResult: action.payload.data,
        checkPesananRangeDateError: action.payload.errorMessage,
      };
    case UPDATE_PESANAN:
      return {
        ...state,
        updatePesananLoading: action.payload.loading,
        updatePesananResult: action.payload.data,
        updatePesananError: action.payload.errorMessage,
      };
    case UPDATE_PESANAN_TRANSACTION:
      return {
        ...state,
        updatePesananTransactionLoading: action.payload.loading,
        updatePesananTransactionResult: action.payload.data,
        updatePesananTransactionError: action.payload.errorMessage,
      };
    case DELETE_PESANAN:
      return {
        ...state,
        deletePesananLoading: action.payload.loading,
        deletePesananResult: action.payload.data,
        deletePesananError: action.payload.errorMessage,
      };
    case CANCEL_PESANAN:
      return {
        ...state,
        cancelPesananLoading: action.payload.loading,
        cancelPesananResult: action.payload.data,
        cancelPesananError: action.payload.errorMessage,
      };
    default:
      return state;
  }
}
