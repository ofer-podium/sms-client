import type { User } from '~core/types/user.type';
import type { ApiResponse } from '~core/types/api-response.type';

export type RegisterResponseData = {
  accessToken: string;
  user: User;
};

export type RegisterResponse = ApiResponse<RegisterResponseData>;
