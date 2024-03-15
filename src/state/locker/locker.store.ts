import { createGlobalState } from "react-hooks-global-state";

type Step = "initial" | "pair_selected" | "lock_success" | "lock_result"

interface LockerStore {
    lockerStep: Step
    editStep: Step
    pairSelected: string | undefined
    isLplocked: boolean
    history: Step[]
}

// Create a single global state object
const store = {
    lockerStep: "initial",
    editStep: "initial",
    pairSelected: undefined,
    isLplocked: false,
    history: []
} as LockerStore;

const { useGlobalState: useLockerState, getGlobalState, setGlobalState } = createGlobalState(store);

export const setLockerStep = (step: Step, add: boolean = false) => {
    const lastStep = getGlobalState("lockerStep")
    const history = getGlobalState("history")
    if(add)
        setGlobalState("history", [...history, lastStep])
    else
        setGlobalState("history", [lastStep])
    setGlobalState("lockerStep", () => step);
};

export const setEditStep = (step: Step, add: boolean = false) => {
    const lastStep = getGlobalState("editStep")
    const history = getGlobalState("history")
    if(add)
        setGlobalState("history", [...history, lastStep])
    else
        setGlobalState("history", [lastStep])
    setGlobalState("editStep", () => step);
};

export const setIsLpLocked = (isLocked: boolean) => {
    setGlobalState("isLplocked", () => isLocked);
};

export const selectPair = (pair: string | undefined) => {
    setGlobalState("pairSelected", pair)
}

export const backLockerStep = () => {
    const history = getGlobalState("history")
    const step = history.pop()
    setGlobalState("history", [...history])
    setGlobalState("lockerStep", step)
}

export const backEditStep = () => {
    const history = getGlobalState("history")
    const step = history.pop()
    setGlobalState("history", [...history])
    setGlobalState("editStep", step)
}

export { useLockerState };
