"use server";

/**
 * @example
 * Example Server Action for form submission as per React 19 spec
 * import { submitForm } from './actions';
 * <form action={submitForm}>...</form>
 */
export async function submitForm(
  prevState: { name: string; error?: string },
  formData: FormData,
) {
  try {
    // ビジネスロジックを実装
    // 例: データベースへの保存、APIコールなど
    const data = Object.fromEntries(formData.entries());

    console.log("Form data received on server:", data);

    // 成功レスポンス
    return {
      success: true,
      message: "Form submitted successfully",
      data,
    };
  } catch (error: unknown) {
    // エラーハンドリング
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong";
    return {
      success: false,
      error: errorMessage,
    };
  }
}
