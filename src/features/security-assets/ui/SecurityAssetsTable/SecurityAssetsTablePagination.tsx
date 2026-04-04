import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/ui";

interface SecurityAssetsTablePaginationProps {
  count: number;
  perPage?: number;
  activePage?: number;
  onPageChange?: (page: number) => void;
}

export function SecurityAssetsTablePagination({
  count,
  perPage = 10,
  activePage = 1,
  onPageChange,
}: SecurityAssetsTablePaginationProps) {
  const pageCount = Math.ceil(count / perPage);

  const handlerPrevious = () => {
    if (activePage > 1) {
      onPageChange?.(activePage - 1);
    }
  };

  const handlerNext = () => {
    if (activePage < pageCount) {
      onPageChange?.(activePage + 1);
    }
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem className="cursor-pointer">
          <PaginationPrevious onClick={handlerPrevious} />
        </PaginationItem>

        {Array.from({ length: pageCount }).map((_, index) => (
          <PaginationItem
            key={index}
            className="cursor-pointer"
            onClick={() => onPageChange?.(index + 1)}
          >
            <PaginationLink isActive={activePage === index + 1}>
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem className="cursor-pointer">
          <PaginationNext onClick={handlerNext} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
