import { createGlobalState } from "react-hooks-global-state";

interface Page {
    id: string
    params: any
}

const store = {
    tab: "create",
    navigations: [],

}

const { useGlobalState: useLockerState, getGlobalState, setGlobalState } = createGlobalState(store);

export const activate = (_tab: string) => {
    const tab = getGlobalState("tab")
    if(tab !== _tab) {
        setGlobalState("navigations", [])
        setGlobalState("tab", _tab)
    }
}

export const navigate = (_id: string, _params?: any) => {
    const navigations = getGlobalState("navigations")
    setGlobalState("navigations", [...navigations, {
        id: _id, params: _params
    }])
}

export const back = (_id?: string) => {
    const navigations = getGlobalState("navigations")
    if(_id) {
        while(true) {
            navigations.pop()
            const [page] = navigations.slice(-1)
            if(navigations.length===0 || page.id===_id)
                break
        }
    } else
        navigations.pop()
    setGlobalState("navigations", [...navigations])
}

export const useLockerPage = () => {
    const [pages] = useLockerState("navigations")
    const [page] = pages.slice(-1)
    return page
}

export { useLockerState };
