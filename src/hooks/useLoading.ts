import { useState } from "react"

const useLoading = () => {
    const [loading, setLoading] = useState<boolean>(false);
    return {
        loading,setLoading
    }
}

export default useLoading