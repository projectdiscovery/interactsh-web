import React, { Suspense } from "react";
import ErrorBoundary from "../../components/common/errorBoundary";
import {
  IssuesListFallback,
  IssuesListErrorFallback,
} from "../../helpers/fallback-loaders";
import styles from "./styles.scss";
import DetailedRequest from "../../components/detailedRequest";

const RequestDetailsWrapper = (props) => {
  const { selectedInteractionData, view } = props;

  return (
    <div
      className={styles.detailed_request}
      style={{ flexDirection: view == "up_and_down" ? "column" : "row" }}
    >
      <ErrorBoundary
        fallback={(error, retry) => (
          <IssuesListErrorFallback error={error} retry={retry} />
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
