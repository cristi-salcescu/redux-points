function createReducer(config, defaultState) {
  return function(state = defaultState, action) {
    if (typeof config[action.type] === "function") {
      return config[action.type](state, action);
    } else {
      return state;
    }
  };
}

function createActionTypes(config) {
  const actionTypes = Object.create(null);
  Object.keys(config).forEach(function addToMap(name) {
    actionTypes[name] = name;
  });
  return Object.freeze(actionTypes);
}

function createReducerAndActionTypes(config, defaultState) {
  return {
    reducer: createReducer(config, defaultState),
    actionTypes: createActionTypes(config)
  };
}

export default createReducerAndActionTypes;
export { createReducer, createActionTypes };