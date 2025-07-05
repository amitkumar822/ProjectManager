import { Loader2 } from 'lucide-react'

function LoadingPage() {
    return (
        <div className="flex items-center justify-center h-[60vh]">
            <Loader2 className="animate-spin h-10 w-10 text-indigo-600" />
        </div>
    )
}

export default LoadingPage