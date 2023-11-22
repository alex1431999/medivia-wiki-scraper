export type Data = {
  items: Item[];
  creatures: Creature[];
}

export type Item = {
  name: string;
  price: number;
  sellto: string;
}

export type Creature = {
  name: string;
  url: string;
}