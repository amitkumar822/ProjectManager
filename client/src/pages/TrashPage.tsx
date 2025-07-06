import ProductCard from "@/components/Card/ProductCard";
import { useGetSoftTrashTaskProjectQuery } from "@/redux/features/api/projectApi"
import { useEffect, useState } from "react";


function TrashPage() {
    const { data, isLoading } = useGetSoftTrashTaskProjectQuery();

    const [results, setResults] = useState<any[]>([]);


    useEffect(() => {
        if (!!data?.data) {
            setResults(data?.data)
        }
    }, [data?.data])


    if (isLoading) {
        return <p>Please Wait....</p>
    }

    return (
        <div className="p-4">
            {/* Results */}
            {data?.data && (
                <ProductCard projectData={results} role="Recyle Bin" />
            )}
        </div>
    )
}

export default TrashPage