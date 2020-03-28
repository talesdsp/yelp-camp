const TYPES = {
  campgrounds: "pages/campgrounds",
  register: "pages/register",
  signIn: "pages/sign_in"
};

export const pagesActions = {
  campgrounds: () => ({type: TYPES.campgrounds}),
  register: () => ({type: TYPES.register}),
  signIn: () => ({type: TYPES.signIn})
};

const INITIAL_STATE = {
  page: "campgrounds"
};

const pagesReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TYPES.campgrounds:
      return state;
    case TYPES.register:
      return {page: "register"};
    case TYPES.signIn:
      return {page: "sign_in"};
    default:
      return state;
  }
};

export default pagesReducer;
