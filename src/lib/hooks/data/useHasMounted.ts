import { useEffect, useState } from "react";

export default function useHasMounted() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    return mounted;
}