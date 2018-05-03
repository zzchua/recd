import { SHOW_RECD_MODAL, HIDE_RECD_MODAL } from './types';

export const showRecdModal = () => {
  return {
    type: SHOW_RECD_MODAL,
  };
};

export const hideRecdModal = () => {
  return {
    type: HIDE_RECD_MODAL,
  };
};
