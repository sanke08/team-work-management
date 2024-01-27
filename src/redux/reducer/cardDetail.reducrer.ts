import { GET_CARD_FAIL, GET_CARD_REQUEST, GET_CARD_SUCCESS } from "../constant"



const initial = {
    loading: true,
    card: null,
    error: ""
}


export const cardDetailReducer = (state = initial, action: { type: string, payload: any }) => {
    switch (action.type) {
        case GET_CARD_REQUEST:
            return {
                loading: true,
                card: null,
            }
        case GET_CARD_SUCCESS:
            return {
                loading: false,
                card: action.payload,
            }
        case GET_CARD_FAIL:
            return {
                loading: false,
                card: null,
                error: "card not found"
            }
        default:
            return {
                ...state
            }
    }

}