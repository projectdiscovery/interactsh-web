'use client';

import React, { Suspense, memo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import DetailedRequest from '@/components/detailedRequest';
import { Data } from '@/lib/types/data';
import { View } from '@/lib/types/view';
import { IssuesListFallback, IssuesListErrorFallback } from '@/helpers/fallback-loaders';

interface RequestDetailsWrapperP {
  view: View;
  selectedInteractionData: Data;
}

const RequestDetailsWrapper = memo((props: RequestDetailsWrapperP) => {
  const { selectedInteractionData, view } = props;

  return (
    <div
      className="detailed_request"
      style={{ flexDirection: view === 'up_and_down' ? 'column' : 'row' }}
    >
      <ErrorBoundary
        FallbackComponent={({ resetErrorBoundary }) => (
          <IssuesListErrorFallback retry={resetErrorBoundary} />
        )}
      >
        <Suspense fallback={<IssuesListFallback />}>
          {view === 'request' ||
          selectedInteractionData.protocol === 'smtp' ||
          selectedInteractionData.protocol === 'ldap' ? (
            <DetailedRequest
              view={view}
              data={`${selectedInteractionData['raw-request']}`}
              title="Request"
              protocol={selectedInteractionData.protocol}
            />
          ) : view === 'response' ? (
            <DetailedRequest
              view={view}
              data={`${selectedInteractionData['raw-response'] || ''}`}
              title="Response"
              protocol={selectedInteractionData.protocol}
            />
          ) : (
            <>
              <DetailedRequest
                view={view}
                data={`${selectedInteractionData['raw-request']}`}
                title="Request"
                protocol={selectedInteractionData.protocol}
              />
              <DetailedRequest
                view={view}
                data={`${selectedInteractionData['raw-response'] || ''}`}
                title="Response"
                protocol={selectedInteractionData.protocol}
              />
            </>
          )}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
});

export default RequestDetailsWrapper;

