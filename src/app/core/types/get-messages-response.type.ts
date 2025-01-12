import type { User } from '~core/types/user.type';
import type { ApiResponse } from '~core/types/api-response.type';

export type GetMeResponseData = {
  user: User;
};

export type GetMeResponse = ApiResponse<GetMeResponseData>;
