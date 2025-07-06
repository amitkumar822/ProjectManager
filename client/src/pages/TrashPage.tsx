import { useEffect, useState } from "react";
import { useGetSoftTrashTaskProjectQuery } from "@/redux/features/api/projectApi";
import ProductCard from "@/components/Card/ProductCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

function TrashPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useGetSoftTrashTaskProjectQuery();
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    if (data?.data) {
      setResults(data.data);
    }
  }, [data]);

  const hasData = results && results.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-purple-100 to-blue-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-purple-800 mb-8">
          🗑️ Recycle Bin
        </h1>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <p className="text-lg text-purple-700 animate-pulse">Loading Trash...</p>
          </div>
        ) : hasData ? (
          <ProductCard projectData={results} role="Recyle Bin" />
        ) : (
          <div className="text-center mt-20 space-y-4">
            <div className="flex justify-center">
              <Trash2 className="h-16 w-16 text-purple-400 opacity-70" />
            </div>
            <p className="text-xl text-gray-600 font-medium">No items in Trash</p>
            <p className="text-sm text-gray-500">
              Deleted tasks and projects will appear here. Items are kept for 30 days before auto-deletion.
            </p>
            <Button
              className="mt-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white px-6 py-2 rounded-full hover:opacity-90 transition"
              onClick={() => navigate("/dashboard")}
            >
              🚀 Go to Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TrashPage;
