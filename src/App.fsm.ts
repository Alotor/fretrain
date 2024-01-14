import { createMachine } from "xstate";

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

export const machine = createMachine(
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



export default machine;
