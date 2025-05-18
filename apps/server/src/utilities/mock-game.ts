import { GameData } from "@knucklebones/shared/types.js";

/**
 * Mocked game data
 */
export const mockGameData: GameData = {
  version: 66,
  new_die: 3,
  status: "playing",
  active_player: "edc97af0-6e18-4c1b-a2a4-8dedc080dbf4",
  winner: ["adc7fece-0398-42f5-a62c-549ebaa9dbbb"],
  created: "2025-04-30T18:49:56.973Z",
  players: [
    {
      score: 47,
      id: "adc7fece-0398-42f5-a62c-549ebaa9dbbb",
      dice: [
        {
          created: "2025-04-30T19:31:31.477Z",
          id: "81b60505-c079-4199-9db4-b6bf81515b8a",
          rack: 2,
          status: "active",
          value: 2,
        },
        {
          created: "2025-04-30T19:31:37.684Z",
          rack: 1,
          status: "active",
          value: 4,
          id: "96538092-2905-4f94-9360-f740939bdac9",
        },
        {
          created: "2025-04-30T19:31:44.002Z",
          id: "b277eae8-5f55-4a38-b5ff-43743d37817c",
          rack: 2,
          status: "active",
          value: 2,
        },
        {
          status: "active",
          value: 3,
          rack: 0,
          id: "61a9aa5b-dbf3-476c-bb18-2e535ab2b0e0",
          created: "2025-04-30T19:33:34.208Z",
        },
        {
          status: "active",
          rack: 0,
          value: 3,
          created: "2025-04-30T19:34:20.697Z",
          id: "c41bfcf0-ca0b-436d-9e81-6f0c20535a35",
        },
        {
          created: "2025-04-30T19:34:35.718Z",
          rack: 1,
          id: "d24c5f1d-e586-4420-8c7e-3d07b7b33457",
          value: 4,
          status: "active",
        },
        {
          created: "2025-04-30T19:34:41.763Z",
          rack: 1,
          value: 5,
          id: "968a480c-abb1-43a4-8ce3-5be3333b1a1e",
          status: "active",
        },
        {
          created: "2025-04-30T19:34:50.834Z",
          id: "14ed1378-2ab7-4b4d-bb48-aa76aaf2f835",
          status: "active",
          rack: 2,
          value: 1,
        },
        {
          rack: 0,
          created: "2025-04-30T19:35:00.909Z",
          status: "active",
          id: "58ec50bf-27e2-4dcc-a1cc-df5118fefdd5",
          value: 5,
        },
      ],
      name: "john",
      host: true,
    },
    {
      id: "edc97af0-6e18-4c1b-a2a4-8dedc080dbf4",
      host: false,
      dice: [
        {
          created: "2025-04-30T19:31:33.760Z",
          id: "c2b84861-01bc-4374-bba6-233264b98634",
          value: 6,
          status: "active",
          rack: 1,
        },
        {
          value: 2,
          status: "active",
          rack: 1,
          id: "605213b2-9d30-4489-90c4-356e2f1ff89e",
          created: "2025-04-30T19:31:41.512Z",
        },
        {
          rack: 1,
          id: "7c810be9-a0b7-4973-bd1d-a4455de742c4",
          created: "2025-04-30T19:31:48.029Z",
          status: "active",
          value: 2,
        },
        {
          status: "active",
          created: "2025-04-30T19:34:17.081Z",
          rack: 2,
          id: "f9939b0b-c7eb-46b0-9beb-d801601e7bac",
          value: 6,
        },
        {
          created: "2025-04-30T19:34:27.054Z",
          id: "7c522413-2bc7-4746-a017-1e778cb4917b",
          value: 3,
          status: "active",
          rack: 2,
        },
        {
          created: "2025-04-30T19:34:38.602Z",
          id: "c6fd6cb0-2d99-4ee2-ba7d-844b6bc81620",
          value: 3,
          status: "active",
          rack: 2,
        },
        {
          value: 1,
          id: "447a5973-6bc4-4829-91fe-ee2f84e14839",
          created: "2025-04-30T19:34:46.940Z",
          rack: 0,
          status: "active",
        },
        {
          status: "active",
          value: 4,
          created: "2025-04-30T19:34:56.448Z",
          id: "40c33065-7ef4-4069-b274-fe1d3972b02a",
          rack: 0,
        },
      ],
      name: "jane",
      score: 37,
    },
  ],
  secrets: [
    {
      id: "adc7fece-0398-42f5-a62c-549ebaa9dbbb",
      secret: "81b60505-c079-4199-9db4-b6bf81515b82",
    },
    {
      id: "edc97af0-6e18-4c1b-a2a4-8dedc080dbf4",
      secret: "f9939b0b-c7eb-46b0-9beb-d801601e7ba2",
    },
  ],
};
