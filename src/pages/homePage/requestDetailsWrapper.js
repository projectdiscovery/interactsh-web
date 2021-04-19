import React, { Suspense } from 'react';
import ErrorBoundary from '../../components/common/errorBoundary';
import { IssuesListFallback, IssuesListErrorFallback } from '../../helpers/fallback-loaders';
import styles from './styles.scss';
import DetailedRequest from '../../components/detailedRequest';

const RequestDetailsWrapper = props => {
  const { selectedInteractionData } = props;
  
  return (
    <div className={styles.detailed_request}>
      <ErrorBoundary
        fallback={(error, retry) => <IssuesListErrorFallback error={error} retry={retry} />}
        refetch={() => refetch(defaultParams)}
      >
        <Suspense fallback={<IssuesListFallback />}>
          <DetailedRequest data={`${selectedInteractionData['raw-request']}`} title={'Request'} />
          <DetailedRequest data={`${selectedInteractionData['raw-response']}`} title={'Response'} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default RequestDetailsWrapper;
