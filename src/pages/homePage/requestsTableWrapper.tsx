import React, { Suspense } from "react";

import { ErrorBoundary } from "react-error-boundary";

import { Data } from "lib/localStorage";

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
}

const RequestsTableWrapper = ({
  data,
  handleRowClick,
  selectedInteraction,
}: RequestsTableWrapperP): JSX.Element => (
  <div className="requests_table_container">
    <ErrorBoundary
      FallbackComponent={({ resetErrorBoundary }) => (
        <RepoSidebarListErrorFallback retry={resetErrorBoundary} />
      )}
    >
      <Suspense fallback={<RepoSidebarListFallback />}>
        <RequestsTable
          data={[...data]}
          handleRowClick={handleRowClick}
          selectedInteraction={selectedInteraction}
        />
      </Suspense>
    </ErrorBoundary>
  </div>
);

export default RequestsTableWrapper;
