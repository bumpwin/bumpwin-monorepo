"use client";

export default function TestPage() {
  return (
    <div>
      <h1>Test Champions API</h1>
      <button
        onClick={async () => {
          try {
            const res = await fetch("/api/champions");
            console.log("Response status:", res.status);
            const data = await res.json();
            console.log("Response data:", data);
          } catch (error) {
            console.error("Error:", error);
          }
        }}
      >
        Test API
      </button>
    </div>
  );
}
