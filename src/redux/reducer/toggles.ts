import { CLOSE_CARD_DETAIL, CLOSE_CREATE_BOARD, CLOSE_CREATE_ORGANIZATION, CLOSE_MEMBER_SETTING, CLOSE_MOBILE_TOGGLE, CLOSE_ORG_SETTING, OPEN_CARD_DETAIL, OPEN_CREATE_BOARD, OPEN_CREATE_ORGANIZATION, OPEN_MEMBER_SETTING, OPEN_MOBILE_TOGGLE, OPEN_ORG_SETTING } from "../constant";


const initial = {
    orgSettings: {
        openOrgSetting: false,
        openMemberSetting: false
    },
    orgToggle: {
        openOrgFild: false,
    },
    mobileToggle: {
        openMobileView: false
    },
    boardToggle: {
        openCreateBoard: false,
    },
    cardDetailToggle: {
        openCardDetail: false
    }

}

export const toggleComponent = (state = initial, action: any) => {
    switch (action.type) {
        case OPEN_CREATE_ORGANIZATION:
            return {
                ...state,
                orgToggle: {
                    openOrgFild: true
                }
            }
        case CLOSE_CREATE_ORGANIZATION:
            return {
                ...state,
                orgToggle: {
                    openOrgFild: false
                }
            }
        case OPEN_MOBILE_TOGGLE:
            return {
                ...state,
                mobileToggle: {
                    openMobileView: true
                }
            }
        case CLOSE_MOBILE_TOGGLE:
            return {
                ...state,
                mobileToggle: {
                    openMobileView: false
                }
            }
        case OPEN_ORG_SETTING:
            return {
                ...state,
                orgSettings: {
                    openOrgSetting: true
                }
            }
        case CLOSE_ORG_SETTING:
            return {
                ...state,
                orgSettings: {
                    openOrgSetting: false
                }
            }
        case OPEN_MEMBER_SETTING:
            return {
                ...state,
                orgSettings: {
                    openMemberSetting: true
                }
            }
        case CLOSE_MEMBER_SETTING:
            return {
                ...state,
                orgSettings: {
                    openMemberSetting: false
                }
            }
        case OPEN_CREATE_BOARD:
            return {
                ...state,
                boardToggle: {
                    openCreateBoard: true
                }
            }
        case CLOSE_CREATE_BOARD:
            return {
                ...state,
                boardToggle: {
                    openCreateBoard: false
                }
            }
        case OPEN_CARD_DETAIL:
            return {
                ...state,
                cardDetailToggle: {
                    openCardDetail: true
                }
            }
        case CLOSE_CARD_DETAIL:
            return {
                ...state,
                cardDetailToggle: {
                    openCardDetail: false
                }
            }
        default:
            return { ...state }
    }
}