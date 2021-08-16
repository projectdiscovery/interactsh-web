import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  IssuesListFallback,
  IssuesListErrorFallback,
} from "../../helpers/fallback-loaders";
import "./styles.scss";
import DetailedRequest from "../../components/detailedRequest";

type View = "request" | "response" | "up_and_down";

interface RequestDetailsWrapperP {
  view: View;
  selectedInteractionData: {
    "raw-request": object;
    "raw-response": object;
  };
}

const RequestDetailsWrapper = (props: RequestDetailsWrapperP) => {
  const { selectedInteractionData, view } = props;

  return (
    <div
      className="detailed_request"
      style={{ flexDirection: view == "up_and_down" ? "column" : "row" }}
    >
      <ErrorBoundary
        FallbackComponent={({ error, resetErrorBoundary }) => (
          <IssuesListErrorFallback error={error} retry={resetErrorBoundary} />
        )}
      >
        <Suspense fallback={<IssuesListFallback />}>
          {view == "request" ? (
            <DetailedRequest
              view={view}
              data={`${selectedInteractionData["raw-request"]}`}
              title="Request"
            />
          ) : view == "response" ? (
            <DetailedRequest
              view={view}
              data={`${selectedInteractionData["raw-response"]}`}
              title="Response"
            />
          ) : (
            <>
              <DetailedRequest
                view={view}
                data={`${selectedInteractionData["raw-request"]}`}
                title="Request"
              />
              <DetailedRequest
                view={view}
                data={`${selectedInteractionData["raw-response"]}`}
                title="Response"
              />
            </>
          )}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default RequestDetailsWrapper;
