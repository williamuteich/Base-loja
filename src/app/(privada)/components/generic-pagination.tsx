"use client";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface GenericPaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function GenericPagination({ page, totalPages, onPageChange }: GenericPaginationProps) {
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

    return (
        <div className="mt-8">
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={handlePrevious}
                            className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                    </PaginationItem>

                    {[...Array(totalPages)].map((_, i) => {
                        const p = i + 1;
                        return (
                            <PaginationItem key={p}>
                                <PaginationLink
                                    href="#"
                                    onClick={(e) => handlePageClick(e, p)}
                                    isActive={page === p}
                                    className="cursor-pointer"
                                >
                                    {p}
                                </PaginationLink>
                            </PaginationItem>
                        );
                    })}

                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={handleNext}
                            className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
