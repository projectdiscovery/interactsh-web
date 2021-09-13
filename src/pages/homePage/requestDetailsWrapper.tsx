import React, { Suspense } from "react";

import { ErrorBoundary } from "react-error-boundary";

import { Data } from "lib/localStorage";
import View from "lib/types/view";

import DetailedRequest from "../../components/detailedRequest";
import { IssuesListFallback, IssuesListErrorFallback } from "../../helpers/fallback-loaders";
import "./styles.scss";

interface RequestDetailsWrapperP {
  view: View;
  selectedInteractionData: Data;
}

const RequestDetailsWrapper = (props: RequestDetailsWrapperP) => {
  const { selectedInteractionData, view } = props;

  return (
    <div
      className="detailed_request"
      style={{ flexDirection: view === "up_and_down" ? "column" : "row" }}
    >
      <ErrorBoundary
        FallbackComponent={({ resetErrorBoundary }) => (
          <IssuesListErrorFallback retry={resetErrorBoundary} />
        )}
      >
        <Suspense fallback={<IssuesListFallback />}>
          {view === "request" || selectedInteractionData.protocol === "smtp" ? (
            <DetailedRequest
              view={view}
              data={`${selectedInteractionData["raw-request"]}`}
              title="Request"
              protocol={selectedInteractionData.protocol}
            />
          ) : view === "response" ? (
            <DetailedRequest
              view={view}
              data={`${selectedInteractionData["raw-response"]}`}
              title="Response"
              protocol={selectedInteractionData.protocol}
            />
          ) : (
            <>
              <DetailedRequest
                view={view}
                data={`${selectedInteractionData["raw-request"]}`}
                title="Request"
                protocol={selectedInteractionData.protocol}
              />
              <DetailedRequest
                view={view}
                data={`${selectedInteractionData["raw-response"]}`}
                title="Response"
                protocol={selectedInteractionData.protocol}
              />
            </>
          )}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default RequestDetailsWrapper;
