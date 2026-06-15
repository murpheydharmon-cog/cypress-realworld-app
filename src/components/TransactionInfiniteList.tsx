import { useMemo } from "react";
import { styled } from "@mui/material/styles";
import { get } from "lodash/fp";
import { useTheme, useMediaQuery, Divider } from "@mui/material";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";

import TransactionItem from "./TransactionItem";
import { TransactionResponseItem, TransactionPagination } from "../models";

const PREFIX = "TransactionInfiniteList";

const classes = {
  transactionList: `${PREFIX}-transactionList`,
};

const StyledRoot = styled("div")(({ theme }) => ({
  [`&.${classes.transactionList}`]: {
    width: "100%",
    minHeight: "80vh",
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
}));

export interface TransactionListProps {
  transactions: TransactionResponseItem[];
  loadNextPage: Function;
  pagination: TransactionPagination;
}

interface RowItemData {
  transactions: TransactionResponseItem[];
  isMobile: boolean;
}

const Row = ({ index, style, data }: ListChildComponentProps<RowItemData>) => {
  const { transactions, isMobile } = data;
  const transaction = get(index, transactions);

  if (index < transactions.length) {
    return (
      <div style={style}>
        <TransactionItem transaction={transaction} />
        <Divider variant={isMobile ? "fullWidth" : "inset"} />
      </div>
    );
  }
  return null;
};

const TransactionInfiniteList: React.FC<TransactionListProps> = ({
  transactions,
  loadNextPage,
  pagination,
}) => {
  const theme = useTheme();
  const isXsBreakpoint = useMediaQuery(theme.breakpoints.down("sm"));
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const itemCount = pagination.hasNextPages ? transactions.length + 1 : transactions.length;

  const loadMoreItems = () => {
    return new Promise<void>((resolve) => {
      resolve(pagination.hasNextPages ? loadNextPage(pagination.page + 1) : undefined);
    });
  };

  const isItemLoaded = (index: number) =>
    !pagination.hasNextPages || index < transactions.length;

  const removePx = (str: string) => +str.slice(0, str.length - 2);

  const itemData = useMemo<RowItemData>(
    () => ({ transactions, isMobile }),
    [transactions, isMobile]
  );

  const listHeight = isXsBreakpoint ? removePx(theme.spacing(74)) : removePx(theme.spacing(88));
  const listWidth = isXsBreakpoint ? removePx(theme.spacing(38)) : removePx(theme.spacing(90));
  const itemSize = isXsBreakpoint ? removePx(theme.spacing(28)) : removePx(theme.spacing(16));

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={loadMoreItems}
      threshold={2}
    >
      {({ onItemsRendered, ref }) => (
        <StyledRoot data-test="transaction-list" className={classes.transactionList}>
          <FixedSizeList
            itemCount={itemCount}
            ref={ref}
            onItemsRendered={onItemsRendered}
            height={listHeight}
            width={listWidth}
            itemSize={itemSize}
            itemData={itemData}
          >
            {Row}
          </FixedSizeList>
        </StyledRoot>
      )}
    </InfiniteLoader>
  );
};

export default TransactionInfiniteList;
