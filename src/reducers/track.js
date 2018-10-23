const initialState = {};

export default function tracks(state = initialState, { type, payload }) {
  // console.log('---', state, action);
  let index;
  switch (type) {
    case 'SELECT_TRACK':
      return payload;
    case 'PREV_TRACK':
      index = state.index - 1;
      if (index < 0) index = payload.max;
      return { index };
    case 'NEXT_TRACK':
      index = state.index + 1;
      if (index > payload.max) index = 0;
      return { index };
    default:
      return state;
  }
}
