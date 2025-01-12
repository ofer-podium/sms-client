import { AUTHENTICATION_PATHS, ROOT_PATHS } from '~core/constants/paths.constants';

export const ROOT_URLS = {
  home: `/${ROOT_PATHS.home}`,
  messages: `/${ROOT_PATHS.messages}`,
  error404: `/${ROOT_PATHS.error404}`,
};

export const AUTH_URLS = {
  logIn: `/${AUTHENTICATION_PATHS.base}/${AUTHENTICATION_PATHS.logIn}`,
  register: `/${AUTHENTICATION_PATHS.base}/${AUTHENTICATION_PATHS.register}`,
};
