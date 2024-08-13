import { useState, useEffect } from "react";


export const getUrl = (geturl: string, tree: string ) => {
  return `${geturl}?treeName=%7B${tree}%7D`
}

export const useFetch = (url: string, refresh:boolean) => {
  const [data, setData] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      setIsPending(true);
      try {
        const response = await fetch(url);
        setCompleted(true);
        const json = await response.json();
        setIsPending(false);
        setData(json);
        if (!response.ok) throw new Error(response.statusText);
        setError(null);
      } catch (error: any) {
        setError(`${error} Could not Fetch Data `);
        setIsPending(false);
      }
    };
    fetchData();
  }, [url, refresh]);
  return { data, isPending, error, completed };
};