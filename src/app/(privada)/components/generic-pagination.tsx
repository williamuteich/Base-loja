"use client";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from "@/components/ui/pagination";
import { useState, useRef, useEffect } from "react";
import { ChevronRight } from "lucide-react";

interface GenericPaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function GenericPagination({ page, totalPages, onPageChange }: GenericPaginationProps) {
    const [jumpPage, setJumpPage] = useState("");

    useEffect(() => {
        setJumpPage("");
    }, [page]);

    if (totalPages <= 1) return null;

    const handlePrevious = (e: React.MouseEvent) => {
        e.preventDefault();
        onPageChange(Math.max(1, page - 1));
    };

    const handleNext = (e: React.MouseEvent) => {
        e.preventDefault();
        onPageChange(Math.min(totalPages, page + 1));
    };

    const handlePageClick = (e: React.MouseEvent, p: number) => {
        e.preventDefault();
        onPageChange(p);
    };

    const handleJumpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const pageNum = parseInt(jumpPage);
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
            onPageChange(pageNum);
            setJumpPage("");
        }
    };

    const getVisiblePages = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];
        let l;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
                range.push(i);
            }
        }

        for (let i of range) {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        }

        return rangeWithDots;
    };

    const visiblePages = getVisiblePages();

    return (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Pagination className="justify-center sm:justify-start">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={handlePrevious}
                            className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                    </PaginationItem>

                    {visiblePages.map((p, i) => (
                        <PaginationItem key={i}>
                            {p === '...' ? (
                                <PaginationEllipsis />
                            ) : (
                                <PaginationLink
                                    href="#"
                                    onClick={(e) => handlePageClick(e, p as number)}
                                    isActive={page === p}
                                    className="cursor-pointer"
                                >
                                    {p}
                                </PaginationLink>
                            )}
                        </PaginationItem>
                    ))}

                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={handleNext}
                            className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>

            <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="whitespace-nowrap">Ir para:</span>
                <input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={jumpPage}
                    onChange={(e) => setJumpPage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleJumpSubmit(e);
                        }
                    }}
                    className="w-16 h-9 px-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900/10 text-center"
                    placeholder="Pg"
                />
                <button
                    type="button"
                    onClick={handleJumpSubmit}
                    disabled={!jumpPage || parseInt(jumpPage) < 1 || parseInt(jumpPage) > totalPages}
                    className="w-9 h-9 flex items-center justify-center bg-slate-900 text-white rounded-md hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
