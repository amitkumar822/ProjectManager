import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, XCircle } from "lucide-react";
import { useSearchTaskProjectQuery } from "@/redux/features/api/projectApi";
import ProductCard from "@/components/Card/ProductCard";
import LoadingPage from "@/components/LoadingPage";
import { useDebounce } from "@/hook/useDebounce";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const {
    data: searchData,
    isLoading,
    isError,
  } = useSearchTaskProjectQuery(debouncedSearchTerm, {
    skip: !debouncedSearchTerm.trim(),
  });

  useEffect(() => {
    if (debouncedSearchTerm.trim() && searchData?.data) {
      setResults(searchData.data);
    } else {
      setResults([]);
    }
  }, [debouncedSearchTerm, searchData]);

  const handleClear = () => {
    setSearchTerm("");
    setResults([]);
  };

  const isValidResultShown =
    !isLoading && debouncedSearchTerm.trim() && results.length > 0 && !isError;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="sticky top-12 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4 rounded-lg">
          <h1 className="text-3xl font-bold text-center text-indigo-800">
            🔍 Search Tasks & Projects
          </h1>

          {/* Search Bar with Clear */}
          <div className="relative flex items-center gap-2 mt-2">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search for task or project..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10 border border-purple-300 focus:ring-2 focus:ring-purple-500"
              />
              <Search className="absolute left-3 top-3 h-5 w-5 text-purple-500" />

              {searchTerm && (
                <XCircle
                  className="absolute right-3 top-3 h-5 w-5 text-gray-400 hover:text-red-500 cursor-pointer"
                  onClick={handleClear}
                />
              )}
            </div>
          </div>
        </div>

        {/* Loading */}
        {isLoading && <LoadingPage />}

        {/* Results */}
        {isValidResultShown && (
          <ProductCard projectData={results} role="Project & Task" />
        )}

        {/* No Results */}
        {isError && (
          <p className="text-center text-gray-500">No results found.</p>
        )}

        {!debouncedSearchTerm.trim() && !isLoading && (
          <div className="text-center mt-10 space-y-2">
            <p className="text-xl text-purple-700 font-semibold">Start Searching</p>
            <p className="text-gray-500 text-sm">
              Enter keywords to find your tasks or projects. Results will appear here.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default SearchPage;
