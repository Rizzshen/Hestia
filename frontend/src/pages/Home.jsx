export default function Home() {
  return (
    <div>
      <h1>Home Page</h1>{" "}
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => (window.location.href = "/dashboard")}
      >
        Go to Dashboard
      </button>
    </div>
  );
}
