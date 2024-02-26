import { createGlobalState } from "react-hooks-global-state";

interface LockerStore {
    lockerStep: "initial" | "pair_selected" | "lock_success" | "lock_result";
}

// Create a single global state object
const deployerStore = {
    lockerStep: "initial",
} as LockerStore;

const { useGlobalState: useLockerState, setGlobalState } = createGlobalState(deployerStore);

export const setLockerStep = (step: LockerStore["lockerStep"]) => {
    setGlobalState("lockerStep", () => step);
};

export { useLockerState };
