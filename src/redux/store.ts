import { combineReducers, createStore } from "redux"
import { toggleComponent } from "./reducer/toggles"
import { cardDetailReducer } from "./reducer/cardDetail.reducrer"


const reducer = combineReducers({
    toggle: toggleComponent,
    cardDetail:cardDetailReducer
})

let initialState = {}



const store = createStore(reducer, initialState)

export default store