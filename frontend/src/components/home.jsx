import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          Certificate Issuance Flow
        </h1>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate("/create-project")}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Step 1: Create Project & Upload Template PDF
          </button>

          <button
            onClick={() => navigate("/upload-batch")}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
          >
            Step 2: Upload Batch ZIP File
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
          >
            Step 3: Issuance Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
