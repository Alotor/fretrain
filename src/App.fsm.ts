import { useRef }  from 'react';
import { createMachine } from "xstate";
import { useMachine } from '@xstate/react';

import { TotalTime } from "@/constants";
import { Store, StoreAction } from "@/store";
import random from "@/random";

export type AppFsmEvents =
  | { type: "note.selected" }
  | { type: "select.fail" }
  | { type: "select.ok" }
  | { type: "select.timeout" }
  | { type: "session.next" }
  | { type: "session.repeat" }
  | { type: "start" }
  | { type: "string.selected" }
  | { type: "string.start" }
  | { type: "time", ellapsed: number };

const machine = createMachine(
  {
    id: "TrainStrings",
    initial: "NewSession",
    states: {
      NewSession: {
        entry: {
          type: "clearState",
        },
        after: {
          "0": {
            target: "#TrainStrings.TrainSession",
            actions: [],
          },
        },
      },
      TrainSession: {
        initial: "WaitingNote",
        states: {
          WaitingNote: {
            entry: {
              type: "selectNote",
            },
            on: {
              "note.selected": {
                target: "TrainStart",
              },
            },
          },
          TrainStart: {
            entry: {
              type: "displayStart",
            },
            on: {
              start: {
                target: "WaitingString",
              },
            },
          },
          WaitingString: {
            entry: {
              type: "selectString",
            },
            on: {
              "string.selected": {
                target: "StringStart",
              },
            },
          },
          StringStart: {
            entry: {
              type: "stringStart",
            },
            exit: {
              type: "startTimer",
            },
            on: {
              "string.start": {
                target: "StringProgress",
              },
            },
          },
          StringProgress: {
            on: {
              time: {
                target: "StringProgress",
                actions: {
                  type: "updateProgress",
                },
              },
              "select.ok": {
                target: "StringOK",
              },
              "select.fail": {
                target: "StringFail",
              },
              "select.timeout": {
                target: "StringFail",
              },
            },
          },
          StringOK: {
            entry: {
              type: "displayOk",
            },
            always: {
              target: "StringEnd",
            },
          },
          StringFail: {
            entry: {
              type: "displayFail",
            },
            always: {
              target: "StringEnd",
            },
          },
          StringEnd: {
            entry: {
              type: "stopTimer",
            },
            always: [
              {
                target: "WaitingString",
                guard: "strings-left",
              },
              {
                target: "TrainEnd",
              },
            ],
          },
          TrainEnd: {
            entry: {
              type: "displayEnd",
            },
            type: "final",
          },
        },
        on: {
          "session.next": {
            target: "NewSession",
          },
          "session.repeat": {
            target: "RepeatNote",
          },
        },
      },
      RepeatNote: {
        entry: {
          type: "clearStringsState",
        },
        after: {
          "0": {
            target: "#TrainStrings.TrainSession.WaitingString",
            actions: [],
          },
        },
      },
    },
    types: {
      events: {} as AppFsmEvents,
    },
  },
);

export function useAppFsm (store: Store, dispatch: (action: StoreAction) => void): [ state: unknown, send: (event: AppFsmEvents) => void ] {
  const timerRef = useRef<number | null>(null);
  const timeSinceStartRef = useRef<number | null>(null);

  const [ state, send ] = useMachine(machine.provide({
    actions: {
      selectNote: () => {
        const note = random.randomNote();
        dispatch({ type: "select-note", note });
        send({ type: "note.selected" });
      },

      selectString: () => {
        const selString = random.nextRandomString(store.stringsState);
        if (selString) {
          dispatch({ type: "select-string", string: selString });
          send({ type: "string.selected" });
        }
      },

      stringStart: () => {
        send({type: "string.start"});
      },

      startTimer: () => {
        timeSinceStartRef.current = new Date().getTime();
        const id = setInterval(() => {
          const startTime = timeSinceStartRef.current;
          if (startTime) {
            const ellapsed = (new Date().getTime() - startTime) / 1000;
            send({type: "time", ellapsed});
          }
        }, 16.6);
        timerRef.current = id;
      },

      stopTimer: () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      },

      updateProgress: ({ event }) => {
        if (event.type === "time") {
          const progress = (event.ellapsed / TotalTime) * 100;
          dispatch({ type: "update-string-progress", progress });
          if (event.ellapsed >= TotalTime) {
            send({ type: "select.timeout" })
          }
        }
      },

      displayStart: () => {
        send({ type: "start" });
      },

      displayOk: () => {
        dispatch({ type: "update-string-state", string: store.selectedString, status: "ok" });
        dispatch({ type: "display-correct", string: store.selectedString });
      },

      displayFail: () => {
        dispatch({ type: "update-string-state", string: store.selectedString, status: "fail" });
        dispatch({ type: "display-correct", string: store.selectedString });
      },

      clearState: () => {
        dispatch({ type: "reset" });
      },
      clearStringsState: () => {
        dispatch({ type: "clear-strings-state" });
      }
      //displayEnd: ({ context, event }) => {},
    },
    guards: {
      "strings-left": () => {
        return !!Object.values(store.stringsState).find(v => v === 'pending');
      },
    }
  }));

  return [state, send];
};
