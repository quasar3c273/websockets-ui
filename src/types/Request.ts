export enum RequestType {
  REG = 'reg',
  CREATE_ROOM = 'create_room',
  ADD_USER_TO_ROOM = 'add_user_to_room',
  ADD_SHIPS = 'add_ships',
  ATTACK = 'attack',
  RANDOM_ATTACK = 'randomAttack',
  SINGLE_PLAY = 'single_play',
}

export type RequestBody = {
  type: `${RequestType}`;
  data: string;
  id: 0;
};
