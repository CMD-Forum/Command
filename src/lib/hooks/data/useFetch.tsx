import { useEffect, useMemo, useState } from "react";

/**
 * ## useFetch
 * ---
 * Fetch request a URL.
 * 
 * @param url The URL the fetch request is sent to.
 * @param method The HTTP Method used, defaults to `POST`.
 * @param headers Any HTTP Headers you want to pass.
 * @param bodyParams Any HTTP Body Parameters you want to pass.
 */

export default function useFetch<T>({ 
    url, 
    method = "POST",
    headers,
    bodyParams,
}: { 
    url: string;
    method?: string;
    headers?: Record<string, string>;
    bodyParams?: Record<string, string>;
}) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [responseMessage, setResponseMessage] = useState<string | null>(null);
    const [errorCode, setErrorCode] = useState<number | null>(null);
    const [statusCode, setStatusCode] = useState<number | null>(null);

    // const token = localStorage.getItem("bearer_token");

    const SERIALIZED_BODY_PARAMS = useMemo(() => JSON.stringify(bodyParams), [bodyParams]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const RES = await fetch(url, {
                    method: method || "POST",
                    headers: {
                        "Content-Type": "application/json",
                        // "Authorization": `Bearer ${token}`,
                        ...headers
                    },
                    body: SERIALIZED_BODY_PARAMS
                });
                if (!RES.ok) setErrorCode(RES.status);
                setStatusCode(RES.status);
                const RESULT: T = await RES.json();
                setData(RESULT);
            } catch (error) {
                // @ts-expect-error: TBD
                setResponseMessage(error.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, [url, /*token,*/ SERIALIZED_BODY_PARAMS, headers, method]);
    
    return { data, loading, responseMessage, errorCode, statusCode };
}