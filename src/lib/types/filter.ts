import { Protocol } from './protocol';

export type Filter = Record<Protocol, boolean>;

export const defaultFilter: Filter = {
  dns: true,
  http: true,
  https: true,
  smtp: true,
};

export default Filter;
