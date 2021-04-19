const USER_NAME_FILTER = /^[-.a-zA-Z0-9]+$/;
const EMAIL_FILTER = /^[-.a-zA-Z0-9]+$/;

const CHECKS = {
  phone: {
    pattern: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/
  },
  userName: {
    filter: USER_NAME_FILTER,
    pattern: /^[a-zA-Z0-9][a-zA-Z0-9-]*$/
  },
  email: {
    filter: EMAIL_FILTER,
    pattern: /^[-.a-zA-Z0-9]+$/
  },
  password: {
    pattern: /^[-.a-zA-Z0-9]+$/
  }
};

export default {
  getPattern: type => CHECKS[type] && CHECKS[type].pattern,

  filter: (type, event) => {
    const check = CHECKS[type] || {};

    if (!check.filter) return;

    const isValid = check.filter.test(event.key);
    if (!isValid) event.preventDefault();
  }
};
