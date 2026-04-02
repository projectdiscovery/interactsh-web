export const protocols = ['dns', 'http', 'https', 'smtp'] as const;
export type Protocol = (typeof protocols)[number];

export const Protocol = {
  eq: {
    equals: (a: Protocol, b: Protocol) => a === b,
  },
  show: {
    show: (p: Protocol) => p.toUpperCase(),
  },
};

export default Protocol;

