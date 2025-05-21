"use client";

import { Button } from "@workspace/shadcn/components/button";
import React, { useState, useOptimistic } from "react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

// サーバーアクションのシミュレーション（実際にはserver.tsなどに配置）
async function addTodoWithDelay(todos: Todo[], newTodo: Todo) {
  // サーバーレイテンシーのシミュレーション
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return [...todos, newTodo];
}

export default function OptimisticUpdates() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "React 19の学習", completed: false },
    { id: 2, text: "Transitionsの理解", completed: false },
  ]);
  const [newTodoText, setNewTodoText] = useState("");

  // useOptimisticフックを使用して楽観的な状態更新を実装
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo: Todo) => [
      ...state,
      { ...newTodo, text: `${newTodo.text} (保存中...)` },
    ],
  );

  const handleAddTodo = async () => {
    if (!newTodoText.trim()) return;

    const newTodo = {
      id: Date.now(),
      text: newTodoText,
      completed: false,
    };

    // 楽観的な更新を即時適用
    addOptimisticTodo(newTodo);

    // 実際のサーバーリクエスト
    const updatedTodos = await addTodoWithDelay(todos, newTodo);

    // サーバーレスポンスで状態を更新
    setTodos(updatedTodos);
    setNewTodoText("");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">useOptimistic Example</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="新しいTodoを入力..."
        />
        <Button onClick={handleAddTodo}>追加</Button>
      </div>

      <ul className="space-y-2">
        {optimisticTodos.map((todo) => (
          <li
            key={todo.id}
            className="p-3 bg-gray-50 rounded-md flex items-center gap-2"
          >
            <span
              className={
                todo.text.includes("保存中") ? "text-gray-400 italic" : ""
              }
            >
              {todo.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
