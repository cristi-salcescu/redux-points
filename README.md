# redux-points
`redux-points` is micro library for creating reducers by convention.
It combines small pure functions to create a reducer.

## Reducer
A reducer is pure function that takes state and an action as parameters and returns the new state.

Here is how the `todos` reducer may look like:
```
import matchesProperty from "lodash/matchesProperty";

function todos(todos = [], action) {
 switch (action.type) {
  case "add_todo":
    const id = getMaxId(todos) + 1;
    const newTodo = { ...action.todo, id };
    return todos.concat([newTodo]);
  case "remove_todo":
    const index = todos.findIndex(matchesProperty("id", action.todo.id));
    return [...todos.slice(0, index), ...todos.slice(index + 1)];
  case "reset_todos":
    return action.todos;
  default:
    return state;
  }
}
export default todos;
```
The state in this case is the list of `todos`. We can apply on it actions like `add_todo`, `remove_todo`, `reset_todos`.

## Reducer by convention
The reducer can be split in small pure functions with names matching the action types. These will be called setter functions. Each of them takes state and action as parameters and returns the new state.
```
function remove_todo(todos, action) {
  const index = todos.findIndex(matchesProperty("id", action.todo.id));
  return [...todos.slice(0, index), ...todos.slice(index + 1)];
}

function reset_todos(todos, action) {
  return action.todos;
}

function add_todo(todos, action) {
  const id = getMaxId(todos) + 1;
  const userId = currentUser;
  const newTodo = { ...action.todo, id, userId };
  return todos.concat([newTodo]);
}
```
`createReducer()` combines all these small functions together to create the original reducer.
```
const reducer = createReducer(
  {
    remove_todo,
    reset_todos,
    add_todo
  },
  []
);
export default reducer;
```
The setter functions will run by convention. When an action of type `remove_todo` comes in, the `remove_todo()` setter function will be executed.

`createActionTypes()` creates the action types based on the setter functions' names. Here is how the object with all action types may look like:
```
{
  remove_todo : "remove_todo",
  reset_todos: "reset_todos",
  add_todo: "add_todo"
}
```

`createReducerAndActionTypes()` creates both the reducer and the action types:
```
const { reducer, actionTypes } = createReducerAndActionTypes(
  { remove_todo, reset_todos, add_todo },
  []
);
export default reducer;
export { actionTypes };
```
Once created, the reducers and all available action types are exported.

Action types can then be used in action creators.
```
import { actionTypes } from "../store/todos";
const { reset_todos, remove_todo, add_todo } = actionTypes;

function resetTodos(todos) {
  return {
    type: reset_todos,
    todos
  };
}

function addTodo(todo) {
  return {
    type: add_todo,
    todo
  };
}

function removeTodo(todo) {
  return {
    type: remove_todo,
    todo
  };
}

export { resetTodos, addTodo, removeTodo };
```

`createReducer()`: creates the reducer by taking in an object with all setter functions and the initial state.

`createActionTypes()`: creates the action types by taking in an object with all setter functions.

`createReducerAndActionTypes()`: creates both the reducer and the action types by convention. It takes in all setter functions and the initial state.