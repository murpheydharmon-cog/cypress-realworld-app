import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { styled } from "@mui/material/styles";
import { get } from "lodash/fp";
import { useTheme, useMediaQuery, Divider } from "@mui/material";
import { FixedSizeList, ListChildComponentProps } from "react-window";

import TransactionItem from "./TransactionItem";
import { TransactionResponseItem, TransactionPagination } from "../models";

const PREFIX = "TransactionInfiniteList";

const classes = {
  transactionList: `${PREFIX}-transactionList`,
};

const Root = styled("div")({
  [`&.${classes.transactionList}`]: {
    width: "100%",
    minHeight: "80vh",
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
});

interface RowItemData {
  transactions: TransactionResponseItem[];
  isMobile: boolean;
}

const Row = React.memo(({ index, style, data }: ListChildComponentProps<RowItemData>) => {
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
});

export interface TransactionListProps {
  transactions: TransactionResponseItem[];
  loadNextPage: Function;
  pagination: TransactionPagination;
}

const TransactionInfiniteList: React.FC<TransactionListProps> = ({
  transactions,
  loadNextPage,
  pagination,
}) => {
  const theme = useTheme();
  const isXsBreakpoint = useMediaQuery(theme.breakpoints.down("sm"));
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const itemCount = pagination.hasNextPages ? transactions.length + 1 : transactions.length;

  const isLoadingRef = useRef(false);

  const removePx = (str: string) => +str.slice(0, str.length - 2);

  const listHeight = isXsBreakpoint ? removePx(theme.spacing(74)) : removePx(theme.spacing(88));
  const listWidth = isXsBreakpoint ? removePx(theme.spacing(38)) : removePx(theme.spacing(90));
  const itemSize = isXsBreakpoint ? removePx(theme.spacing(28)) : removePx(theme.spacing(16));

  const handleItemsRendered = useCallback(
    ({ visibleStopIndex }: { visibleStopIndex: number }) => {
      if (
        pagination.hasNextPages &&
        visibleStopIndex >= transactions.length - 1 &&
        !isLoadingRef.current
      ) {
        isLoadingRef.current = true;
        Promise.resolve(loadNextPage(pagination.page + 1)).then(() => {
          isLoadingRef.current = false;
        });
      }
    },
    [pagination.hasNextPages, pagination.page, transactions.length, loadNextPage]
  );

  useEffect(() => {
    isLoadingRef.current = false;
  }, [transactions.length]);

  const itemData = useMemo<RowItemData>(
    () => ({ transactions, isMobile }),
    [transactions, isMobile]
  );

  return (
    <Root data-test="transaction-list" className={classes.transactionList}>
      <FixedSizeList
        height={listHeight}
        width={listWidth}
        itemSize={itemSize}
        itemCount={itemCount}
        itemData={itemData}
        onItemsRendered={handleItemsRendered}
      >
        {Row}
      </FixedSizeList>
    </Root>
  );
};

export default TransactionInfiniteList;
