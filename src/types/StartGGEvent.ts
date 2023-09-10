export interface StartGGEvent {
  id: string;
  event: string;
  tournament: string;
  entrantCount: number;
  imageUrl: string;
  startggUrl: string;
}

export const emptyStartGGEvent = {
  id: "",
  event: "",
  tournament: "",
  entrantCount: 0,
  imageUrl: "",
  startggUrl: "",
};
