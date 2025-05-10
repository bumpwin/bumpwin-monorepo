import type { Result } from "neverthrow";
import type { ApiError } from "./error";
import type {
  GetProfileByIdRequest,
  GetProfileByIdResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
} from "./types";

// Repository interface
export interface DbRepository {
  findProfileById(
    request: GetProfileByIdRequest,
  ): Promise<Result<GetProfileByIdResponse, ApiError>>;
  updateProfile(
    request: UpdateProfileRequest,
  ): Promise<Result<UpdateProfileResponse, ApiError>>;
}
