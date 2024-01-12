import { createMachine } from "xstate";

export const machine = createMachine(
  {
    id: "Fretrain state (copy)",
    initial: "NewSession",
    states: {
      NewSession: {
        entry: {
          type: "clearState",
        },
        always: {
          target: "TrainNotes",
        },
      },
      TrainNotes: {
        initial: "WaitingNote",
        states: {
          WaitingNote: {
            entry: {
              type: "selectNote",
            },
            on: {
              "note.selected": {
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
                target: "StringProgress",
                actions: {
                  type: "startTimer",
                },
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
        always: {
          target: "#Fretrain state (copy).TrainNotes.WaitingString",
        },
      },
    },
    types: {
      events: {} as
        | { type: "time", ellapsed: number }
        | { type: "select.ok" }
        | { type: "select.fail" }
        | { type: "note.selected" }
        | { type: "select.timeout" }
        | { type: "string.selected" }
        | { type: "session.next" }
        | { type: "session.repeat" },
    },
  },
);
export default machine;
