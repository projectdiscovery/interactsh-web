import { Protocol } from './protocol';

export type Filter = Record<Protocol, boolean>;

export const defaultFilter: Filter = {
  dns: true,
  http: true,
  https: true,
  smtp: true,
  ldap: true,
};

export default Filter;
