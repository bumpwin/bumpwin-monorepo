"use server";

import { ApiErrors } from "@workspace/utils";
import { Effect } from "effect";

// ✅ Effect-ts compliant server action errors
type ServerActionError =
  | ReturnType<typeof ApiErrors.validation>
  | ReturnType<typeof ApiErrors.database>
  | ReturnType<typeof ApiErrors.network>
  | ReturnType<typeof ApiErrors.unknown>;

// ✅ Type-safe result type
type ServerActionResult<T> =
  | { success: true; data: T; message: string }
  | { success: false; error: string };

/**
 * @example
 * Example Server Action for form submission as per React 19 spec
 * import { submitForm } from './actions';
 * <form action={submitForm}>...</form>
 */
export async function submitForm(
  _prevState: { name: string; error?: string },
  formData: FormData,
): Promise<ServerActionResult<Record<string, FormDataEntryValue>>> {
  const submitFormEffect = Effect.gen(function* () {
    // Validate form data
    const data = Object.fromEntries(formData.entries());

    if (Object.keys(data).length === 0) {
      yield* Effect.fail(ApiErrors.validation("Form data is empty", data));
    }

    // ビジネスロジックを実装
    // 例: データベースへの保存、APIコールなど
    yield* Effect.log("Form data received on server:");
    yield* Effect.log(JSON.stringify(data, null, 2));

    // 成功レスポンス
    return {
      success: true as const,
      message: "Form submitted successfully",
      data,
    };
  });

  // ✅ Effect-ts error handling with proper pattern matching
  return await Effect.runPromise(
    submitFormEffect.pipe(
      Effect.catchAll((error: ServerActionError) =>
        Effect.succeed({
          success: false as const,
          error: error.message || "Something went wrong",
        }),
      ),
    ),
  );
}
