import { SHOW_RECD_MODAL, HIDE_RECD_MODAL } from '../actions/types';

const INITIAL_STATE = {
  recdModalVisible: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SHOW_RECD_MODAL:
      return { ...state, recdModalVisible: true };
    case HIDE_RECD_MODAL:
      return { ...state, recdModalVisible: false };
    default:
      return state;
  }
};
