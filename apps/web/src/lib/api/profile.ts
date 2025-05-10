import { logger } from "@workspace/logger";
import { getAuthSession } from "@workspace/supabase/src/auth";
import type { Profile } from "@workspace/supabase/src/domain";

export interface UpdateProfileParams {
  displayName: string;
  avatarFile?: File;
}

export const profileApi = {
  async fetch(userId: string): Promise<Profile> {
    try {
      const response = await fetch(`/api/profile?userId=${userId}`);
      const data = await response.json();
      if (!response.ok) {
        logger.error("Failed to fetch profile", {
          error: (data as { error: string }).error,
        });
        throw new Error((data as { error: string }).error);
      }
      return data as Profile;
    } catch (error) {
      logger.error("Error fetching profile", { error });
      throw error;
    }
  },

  async update(params: UpdateProfileParams): Promise<void> {
    try {
      const session = await getAuthSession();
      const formData = new FormData();

      formData.append("display_name", params.displayName);

      if (params.avatarFile) {
        formData.append("avatar_file", params.avatarFile);
      }

      const response = await fetch("/api/profile/update", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        logger.error("Failed to update profile", {
          error: (data as { error: string }).error,
        });
        throw new Error((data as { error: string }).error);
      }
    } catch (error) {
      logger.error("Error updating profile", { error });
      throw error;
    }
  },
};
