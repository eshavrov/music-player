const initialState = [];

export default function tracks(state = initialState, { type, payload }) {
  switch (type) {
    case 'ADD_TRACK':
      return !state.filter(
        track => track.fileName === payload.fileName && track.size === payload.size
      ).length
        ? [...state, { ...payload }]
        : state;
    default:
      return state;
  }
}
