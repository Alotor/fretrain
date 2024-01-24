import { useRef, useEffect }  from 'react';
import { createMachine } from "xstate";
import { useMachine } from '@xstate/react';

import { useOptionsStorage } from "@/OptionsStorage";
import { Store, StoreAction } from "@/store";
import utils from "@/utils";

export type AppFsmEvents =
  | { type: "train.start" }
  | { type: "train.next" }
  | { type: "train.init" }
  | { type: "train.repeat" }
  | { type: "step.init" }
  | { type: "step.start" }
  | { type: "step.progress", progress: number }
  | { type: "step.ok" }
  | { type: "step.timeout" }
  | { type: "step.fail" };


export const machine = createMachine(
  {
    id: "TrainingSession",
    initial: "NewTraining",
    states: {
      NewTraining: {
        entry: {
          type: "clearTrainingData",
        },
        after: {
          "0": {
            target: "#TrainingSession.TrainingSession",
            actions: [],
          },
        },
      },
      TrainingSession: {
        exit: {
          type: "saveTrainStats",
        },
        initial: "InitTraining",
        states: {
          InitTraining: {
            entry: {
              type: "initTrainingData",
            },
            on: {
              "train.init": {
                target: "TrainingStart",
              },
            },
          },
          TrainingStart: {
            entry: {
              type: "displayTrainingStart",
            },
            on: {
              "train.start": {
                target: "InitTrainingStep",
              },
            },
          },
          InitTrainingStep: {
            entry: {
              type: "initTrainingStepData",
            },
            on: {
              "step.init": {
                target: "StepStart",
              },
            },
          },
          StepStart: {
            entry: {
              type: "displayStepStart",
            },
            exit: {
              type: "startTimer",
            },
            on: {
              "step.start": {
                target: "StepProgress",
              },
            },
          },
          StepProgress: {
            on: {
              "step.progress": {
                target: "StepProgress",
                actions: {
                  type: "updateStepProgress",
                },
              },
              "step.ok": {
                target: "StepOK",
              },
              "step.fail": {
                target: "StepFail",
              },
              "step.timeout": {
                target: "StepFail",
              },
            },
          },
          StepOK: {
            entry: {
              type: "displayStepOk",
            },
            always: {
              target: "StepEnd",
            },
          },
          StepFail: {
            entry: {
              type: "displayStepFail",
            },
            always: {
              target: "StepEnd",
            },
          },
          StepEnd: {
            entry: {
              type: "stopTimer",
            },
            always: [
              {
                target: "TrainEnd",
                guard: "train-finish",
              },
              {
                target: "InitTrainingStep",
              },
            ],
          },
          TrainEnd: {
            entry: {
              type: "displayTrainingEnd",
            },
            type: "final",
          },
        },
        on: {
          "train.next": {
            target: "NewTraining",
          },
          "train.repeat": {
            target: "RepeatTraining",
          },
        },
      },
      RepeatTraining: {
        entry: {
          type: "setTrainingData",
        },
        after: {
          "0": {
            target: "#TrainingSession.TrainingSession.InitTrainingStep",
            actions: [],
          },
        },
      },
    },
    types: {
      events: {} as AppFsmEvents,
    },
  }
);
export function useAppFsm (store: Store, dispatch: (action: StoreAction) => void): [ state: unknown, send: (event: AppFsmEvents) => void ] {
  const timerRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const storeRef = useRef<Store>(store);
  const [ options, _ ] = useOptionsStorage();

  useEffect(() => {
    storeRef.current = store;
  }, [store]);

  const [ state, send ] = useMachine(machine.provide({
    actions: {
      clearTrainingData: () => {
        dispatch({ type: "reset" });
      },

      setTrainingData: () => {
        dispatch({ type: "clear-strings-state" });
      },

      initTrainingData: () => {
        const note = utils.selectNote(options, storeRef.current.selectedNote);
        dispatch({ type: "select-note", note });
        console.log(">note", note);
        send({ type: "train.init" });
      },

      displayTrainingStart: () => {
        send({ type: "train.start" });
      },

      initTrainingStepData: () => {
        const selString = utils.selectString(options, store.stringsState);
        if (selString) {
          dispatch({ type: "select-string", string: selString });
          send({ type: "step.init" });
        } 
      },

      displayStepStart: () => {
        send({ type: "step.start" });
      },

      startTimer: () => {
        lastTimeRef.current = new Date().getTime();
        const id = setInterval(() => {
          const store = storeRef.current;
          const currentTime = new Date().getTime();
          if (!store.paused && !store.showOptions) {
            const lastTime = lastTimeRef.current!;
            const ellapsed = (currentTime - lastTime) / 1000;
            const progress = (ellapsed / options.speed) * 100;
            send({type: "step.progress", progress});
          }
          lastTimeRef.current = currentTime;
        }, 16.6);
        timerRef.current = id;
      },

      updateStepProgress: ({ event }) => {
        if (event.type === "step.progress") {
          dispatch({ type: "update-string-progress", progress: event.progress });
          if (store.selectedStringProgress + event.progress > 100) {
            send({ type: "step.timeout" });
          }
        }
      },

      displayStepOk: () => {
        dispatch({ type: "update-string-state", string: store.selectedString, status: "ok" });
        dispatch({ type: "display-correct", string: store.selectedString });
      },
      
      displayStepFail: () => {
        dispatch({ type: "update-string-state", string: store.selectedString, status: "fail" });
        dispatch({ type: "display-correct", string: store.selectedString });
      },
      
      stopTimer: () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      },

      displayTrainingEnd: () => {
        setTimeout(() => {
          if (options.endSessionBehavior === "repeat") {
            send({ type: "train.repeat" });
          } else if (options.endSessionBehavior === "next") {
            send({ type: "train.next" });
          }  
        }, options.speed * 1000)
      },
      
      saveTrainStats: () => {
      },
    },
    guards: {
      "train-finish": () => {
        return !utils.isStringsLeft(options, store.stringsState);
      },
    }
  }));
  
  return [state, send];
};
