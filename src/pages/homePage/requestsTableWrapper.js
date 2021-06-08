import React, { Suspense } from 'react';
import ErrorBoundary from '../../components/common/errorBoundary';
import {
  RepoSidebarListFallback,
  RepoSidebarListErrorFallback
} from '../../helpers/fallback-loaders';
import styles from './styles.scss';
import RequestsTable from '../../components/requestsTable';

const RequestsTableWrapper = props => {
  const { data, handleRowClick, selectedInteraction } = props;
  // console.log('newData');
  console.log(data);
  return (
    <div className={styles.requests_table_container}>
      <ErrorBoundary
        fallback={(error, retry) => <RepoSidebarListErrorFallback error={error} retry={retry} />}
        refetch={() => refetch(defaultParams)}
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
