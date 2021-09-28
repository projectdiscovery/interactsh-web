import React, { Suspense } from "react";

import { ErrorBoundary } from "react-error-boundary";

import Data from "lib/types/data";
import Filter from "lib/types/filter";

import RequestsTable from "../../components/requestsTable";
import {
  RepoSidebarListFallback,
  RepoSidebarListErrorFallback,
} from "../../helpers/fallback-loaders";
import "./styles.scss";

interface RequestsTableWrapperP {
  data: Data[];
  handleRowClick: (id: string) => void;
  selectedInteraction: string;
  filter: Filter;
}

const RequestsTableWrapper = ({
  data,
  handleRowClick,
  selectedInteraction,
  filter,
}: RequestsTableWrapperP): JSX.Element => (
  <div className="requests_table_container">
    <ErrorBoundary
      FallbackComponent={({ resetErrorBoundary }) => (
        <RepoSidebarListErrorFallback retry={resetErrorBoundary} />
      )}
    >
      <Suspense fallback={<RepoSidebarListFallback />}>
        <RequestsTable
          data={[...data].reverse()}
          handleRowClick={handleRowClick}
          selectedInteraction={selectedInteraction}
          filter={filter}
        />
      </Suspense>
    </ErrorBoundary>
  </div>
);

export default RequestsTableWrapper;
