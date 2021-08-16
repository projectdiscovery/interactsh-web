import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  RepoSidebarListFallback,
  RepoSidebarListErrorFallback,
} from "../../helpers/fallback-loaders";
import "./styles.scss";
import RequestsTable from "../../components/requestsTable";

interface RequestsTableWrapperP {
  data: object[];
  handleRowClick: () => void;
  selectedInteraction: void;
}

const RequestsTableWrapper = (props: RequestsTableWrapperP) => {
  const { data, handleRowClick, selectedInteraction } = props;
  // console.log('newData');
  return (
    <div className="requests_table_container">
      <ErrorBoundary
        FallbackComponent={({ error, resetErrorBoundary }) => (
          <RepoSidebarListErrorFallback
            error={error}
            retry={resetErrorBoundary}
          />
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
};

export default RequestsTableWrapper;
