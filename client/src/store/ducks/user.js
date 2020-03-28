const TYPES = {
  signIn: "users/sign_in",
  signOut: "users/sign_out",
  register: "users/register",
};

export const usersActions = {
  signIn: (data) => ({ type: TYPES.signIn, payload: { ...data } }),
  signOut: () => ({ type: TYPES.signOut }),
  register: (data) => ({ type: TYPES.register, payload: { ...data } }),
};

const INITIAL_STATE = {
  id: null,
  username: null,
  isAdmin: null,
};

const usersReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TYPES.signIn:
      return action.payload;
    case TYPES.signOut:
      return INITIAL_STATE;
    case TYPES.register:
      return action.payload;
    default:
      return state;
  }
};

export default usersReducer;
