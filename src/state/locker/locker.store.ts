import { createGlobalState } from "react-hooks-global-state";

interface LockerStore {
    lockerStep: "initial" | "pair_selected" | "lock_success" | "lock_result";
    editStep: "initial" | "pair_selected";
    isLplocked: boolean
}

// Create a single global state object
const deployerStore = {
    lockerStep: "initial",
    editStep: "initial",
    isLplocked: false
} as LockerStore;

const { useGlobalState: useLockerState, setGlobalState } = createGlobalState(deployerStore);

export const setLockerStep = (step: LockerStore["lockerStep"]) => {
    setGlobalState("lockerStep", () => step);
};

export const setEditStep = (step: LockerStore["editStep"]) => {
    setGlobalState("editStep", () => step);
};

export const setIsLpLocked = (isLocked: boolean) => {
    setGlobalState("isLplocked", () => isLocked);
};

export { useLockerState };
