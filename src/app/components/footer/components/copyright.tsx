"use client";

import { useEffect, useState } from "react";

export default function Copyright() {
    const [year, setYear] = useState<number>(2026);

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    return <span>{year}</span>;
}
