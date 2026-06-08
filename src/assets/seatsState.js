import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({
  key: "seatsStorage",
  storage: localStorage,
});

export const activeSeatsState = atom({
  key: "activeSeatsState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const seatsState = atom({
  key: "seatsState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});



export const rowState = atom({
  key: "rowState",
  default: 5,
  effects_UNSTABLE: [persistAtom],
});

export const columnState = atom({
  key: "columnState",
  default: 5,
  effects_UNSTABLE: [persistAtom],
});

export const lostNumbersState = atom({
  key: "lostNumbersState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
export const currentClassState = atom({
  key: "currentClassState",
  default: null,
    effects_UNSTABLE: [persistAtom],
});
export const studentsState = atom({
  key: "studentsState",
  default: [
    {
      id: 1,
      name: "",
    },
  ],
  effects_UNSTABLE: [persistAtom],
});
export const displayModeState =
  atom({
    key: "displayModeState",

    default: "id",
    // "name" | "id"
  });