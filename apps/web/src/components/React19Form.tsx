"use client";

import { submitForm } from "@/app/actions";
import { Button } from "@workspace/shadcn/components/button";
import { Input } from "@workspace/shadcn/components/input";
import { useState } from "react";

interface FormState {
  name: string;
  error?: string;
}

interface FormStatusType {
  pending: boolean;
  error: Error | null;
}

// FormStatusコンポーネント - フォーム送信状態管理のための独自実装
function SubmitButton() {
  // React 19のuseFormStatusの代替実装
  const formStatus: FormStatusType = {
    pending: false,
    error: null,
  };

  return (
    <Button type="submit" disabled={formStatus.pending} className="w-full">
      {formStatus.pending ? "送信中..." : "送信"}
    </Button>
  );
}

export default function React19Form() {
  const [state, setState] = useState<FormState>({ name: "" });
  const [isPending, setIsPending] = useState(false);

  // Server Actionラッパー
  async function handleFormSubmit(formData: FormData) {
    setIsPending(true);
    try {
      const result = await submitForm(state, formData);
      if (!result.success) {
        setState({ ...state, error: result.error });
      } else if (result.data && typeof result.data.name === "string") {
        setState({ name: result.data.name });
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      setState({ ...state, error: errorMessage });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">React 19 Form Example</h2>

      <form action={handleFormSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name
          </label>
          <Input
            id="name"
            name="name"
            defaultValue={state.name}
            className="w-full"
          />
        </div>

        <SubmitButton />

        {state.error && <p className="text-red-500 text-sm">{state.error}</p>}

        {/* Transitionコンポーネントの例 */}
        <div className="mt-4">
          {isPending ? (
            <Transition>
              <div className="p-2 bg-green-100 rounded">フォーム送信中...</div>
            </Transition>
          ) : null}
        </div>
      </form>
    </div>
  );
}

// React 19のTransitionコンポーネント
function Transition({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="transition-opacity duration-300">{children}</div>;
}
