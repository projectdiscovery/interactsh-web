import React from 'react';
import ContentLoader from 'react-content-loader';
import { Icon } from 'antd';
import styles from './styles.scss';

const OverviewStatsErrorFallback = ({ error, retry }) => {
  return (
    <div
      className={styles.retry_error_fallback}
      style={{
        height: '26rem',
        background: 'transparent'
      }}
    >
      <div onClick={retry} className={styles.error_box}>
        <Icon type="redo" />
      </div>
      <span className={styles.error_msg}>{'Request failed!'}</span>
    </div>
  );
};
const StarsOvertimeErrorFallback = ({ error, retry }) => {
  return (
    <div
      className={styles.retry_error_fallback}
      style={{
        height: '74rem',
        background: 'transparent'
      }}
    >
      <div onClick={retry} className={styles.error_box}>
        <Icon type="redo" />
      </div>
      <span className={styles.error_msg}>{'Request failed!'}</span>
    </div>
  );
};
const DailyStarsErrorFallback = ({ error, retry }) => {
  return (
    <div
      className={styles.retry_error_fallback}
      style={{
        height: '45rem',
        background: 'transparent'
      }}
    >
      <div onClick={retry} className={styles.error_box}>
        <Icon type="redo" />
      </div>
      <span className={styles.error_msg}>{'Request failed!'}</span>
    </div>
  );
};
const FiltersErrorFallback = ({ error, retry }) => {
  return (
    <div
      className={styles.retry_error_fallback}
      style={{
        height: '2.7rem',
        background: 'transparent'
      }}
    >
      <div onClick={retry} className={styles.error_box}>
        <Icon type="redo" />
      </div>
      <span className={styles.error_msg}>{'Request failed!'}</span>
    </div>
  );
};
const StargazersListErrorFallback = ({ error, retry }) => {
  return (
    <div
      className={styles.retry_error_fallback}
      style={{
        height: '50rem',
        background: 'transparent'
      }}
    >
      <div onClick={retry} className={styles.error_box}>
        <Icon type="redo" />
      </div>
      <span className={styles.error_msg}>{'Request failed!'}</span>
    </div>
  );
};
const ContributorsListErrorFallback = ({ error, retry }) => {
  return (
    <div
      className={styles.retry_error_fallback}
      style={{
        height: '50rem',
        background: 'transparent'
      }}
    >
      <div onClick={retry} className={styles.error_box}>
        <Icon type="redo" />
      </div>
      <span className={styles.error_msg}>{'Request failed!'}</span>
    </div>
  );
};
const RepositoriesListErrorFallback = ({ error, retry }) => {
  return (
    <div
      className={styles.retry_error_fallback}
      style={{
        height: '50rem',
        background: 'transparent'
      }}
    >
      <div onClick={retry} className={styles.error_box}>
        <Icon type="redo" />
      </div>
      <span className={styles.error_msg}>{'Request failed!'}</span>
    </div>
  );
};
const EfficiencyStatsErrorFallback = ({ error, retry }) => {
  return (
    <div
      className={styles.retry_error_fallback}
      style={{
        height: '26rem',
        background: 'transparent'
      }}
    >
      <div onClick={retry} className={styles.error_box}>
        <Icon type="redo" />
      </div>
      <span className={styles.error_msg}>{'Request failed!'}</span>
    </div>
  );
};
const RepoSidebarListErrorFallback = ({ error, retry }) => {
  return (
    <div
      className={styles.retry_error_fallback}
      style={{
        height: '26rem',
        background: 'transparent'
      }}
    >
      <div onClick={retry} className={styles.error_box}>
        <Icon type="redo" />
      </div>
      <span className={styles.error_msg}>{'Request failed!'}</span>
    </div>
  );
};
const IssuesListErrorFallback = ({ error, retry }) => {
  return (
    <div
      className={styles.retry_error_fallback}
      style={{
        height: '26rem',
        background: 'transparent'
      }}
    >
      <div onClick={retry} className={styles.error_box}>
        <Icon type="redo" />
      </div>
      <span className={styles.error_msg}>{'Request failed!'}</span>
    </div>
  );
};
const RepoStatsErrorFallback = ({ error, retry }) => {
  return (
    <div
      className={styles.retry_error_fallback}
      style={{
        height: '26rem',
        background: 'transparent'
      }}
    >
      <div onClick={retry} className={styles.error_box}>
        <Icon type="redo" />
      </div>
      <span className={styles.error_msg}>{'Request failed!'}</span>
    </div>
  );
};

const OverviewStatsFallback = () => (
  <ContentLoader
    speed={1}
    width="100%"
    height="26rem"
    preserveAspectRatio="none"
    backgroundColor="rgba(150,150,150, 0.1)"
    foregroundColor="rgba(150,150,150, 0.1)"
  >
    <rect opacity="0.3" x="0" y="0.368470013" width="100%" height="100%" rx="10" />
  </ContentLoader>
);
const StarsOvertimeFallback = () => (
  <ContentLoader
    speed={1}
    width="100%"
    height="74rem"
    preserveAspectRatio="none"
    backgroundColor="rgba(150,150,150, 0.1)"
    foregroundColor="rgba(150,150,150, 0.1)"
  >
    <rect opacity="0.3" x="0" y="0.368470013" width="100%" height="100%" rx="10" />
  </ContentLoader>
);
const DailyStarsFallback = () => (
  <ContentLoader
    speed={1}
    width="100%"
    height="45rem"
    preserveAspectRatio="none"
    backgroundColor="rgba(150,150,150, 0.1)"
    foregroundColor="rgba(150,150,150, 0.1)"
  >
    <rect opacity="0.3" x="0" y="0.368470013" width="100%" height="100%" rx="10" />
  </ContentLoader>
);
const FiltersFallback = () => (
  <ContentLoader
    speed={1}
    width="150"
    height="2.7rem"
    preserveAspectRatio="none"
    backgroundColor="rgba(150,150,150, 0.1)"
    foregroundColor="rgba(150,150,150, 0.1)"
  >
    <rect opacity="0.3" x="10" y="0.368470013" width="130" height="100%" rx="6" />
  </ContentLoader>
);
const StargazersListFallback = () => (
  <ContentLoader
    speed={1}
    width="100%"
    height="74rem"
    preserveAspectRatio="none"
    backgroundColor="rgba(150,150,150, 0.1)"
    foregroundColor="rgba(150,150,150, 0.1)"
  >
    <rect opacity="0.3" x="18rem" y="20" width="calc(100% - 36rem)" height="70" rx="10" />
    <rect opacity="0.3" x="18rem" y="110" width="calc(100% - 36rem)" height="70" rx="10" />
    <rect opacity="0.3" x="18rem" y="200" width="calc(100% - 36rem)" height="70" rx="10" />
    <rect opacity="0.3" x="18rem" y="290" width="calc(100% - 36rem)" height="70" rx="10" />
    <rect opacity="0.3" x="18rem" y="380" width="calc(100% - 36rem)" height="70" rx="10" />
    <rect opacity="0.3" x="18rem" y="470" width="calc(100% - 36rem)" height="70" rx="10" />
    <rect opacity="0.3" x="18rem" y="560" width="calc(100% - 36rem)" height="70" rx="10" />
    <rect opacity="0.3" x="18rem" y="650" width="calc(100% - 36rem)" height="70" rx="10" />
    <rect opacity="0.3" x="18rem" y="740" width="calc(100% - 36rem)" height="70" rx="10" />
  </ContentLoader>
);
const ContributorsListFallback = () => (
  <ContentLoader
    speed={1}
    width="100%"
    height="74rem"
    preserveAspectRatio="none"
    backgroundColor="rgba(150,150,150, 0.1)"
    foregroundColor="rgba(150,150,150, 0.1)"
  >
    <rect opacity="0.3" x="2rem" y="10" width="calc(100% - 4rem)" height="70" rx="10" />
    <rect opacity="0.3" x="2rem" y="100" width="calc(100% - 4rem)" height="70" rx="10" />
    <rect opacity="0.3" x="2rem" y="190" width="calc(100% - 4rem)" height="70" rx="10" />
    <rect opacity="0.3" x="2rem" y="280" width="calc(100% - 4rem)" height="70" rx="10" />
    <rect opacity="0.3" x="2rem" y="370" width="calc(100% - 4rem)" height="70" rx="10" />
    <rect opacity="0.3" x="2rem" y="460" width="calc(100% - 4rem)" height="70" rx="10" />
    <rect opacity="0.3" x="2rem" y="550" width="calc(100% - 4rem)" height="70" rx="10" />
    <rect opacity="0.3" x="2rem" y="640" width="calc(100% - 4rem)" height="70" rx="10" />
    <rect opacity="0.3" x="2rem" y="730" width="calc(100% - 4rem)" height="70" rx="10" />
  </ContentLoader>
);
const RepositoriesListFallback = () => (
  <ContentLoader
    speed={1}
    width="100%"
    height="74rem"
    preserveAspectRatio="none"
    backgroundColor="rgba(150,150,150, 0.1)"
    foregroundColor="rgba(150,150,150, 0.1)"
  >
    <rect opacity="0.3" x="2rem" y="10" width="calc(100% - 4rem)" height="10.8rem" rx="10" />
    <rect opacity="0.3" x="2rem" y="138" width="calc(100% - 4rem)" height="10.8rem" rx="10" />
    <rect opacity="0.3" x="2rem" y="266" width="calc(100% - 4rem)" height="10.8rem" rx="10" />
    <rect opacity="0.3" x="2rem" y="394" width="calc(100% - 4rem)" height="10.8rem" rx="10" />
    <rect opacity="0.3" x="2rem" y="522" width="calc(100% - 4rem)" height="10.8rem" rx="10" />
    <rect opacity="0.3" x="2rem" y="650" width="calc(100% - 4rem)" height="10.8rem" rx="10" />
    <rect opacity="0.3" x="2rem" y="778" width="calc(100% - 4rem)" height="10.8rem" rx="10" />
    <rect opacity="0.3" x="2rem" y="906" width="calc(100% - 4rem)" height="10.8rem" rx="10" />
    <rect opacity="0.3" x="2rem" y="730" width="calc(100% - 4rem)" height="10.8rem" rx="10" />
  </ContentLoader>
);
const EfficiencyStatsFallback = () => (
  <ContentLoader
    speed={1}
    width="100%"
    height="13.3rem"
    preserveAspectRatio="none"
    backgroundColor="rgba(150,150,150, 0.1)"
    foregroundColor="rgba(150,150,150, 0.1)"
  >
    <rect
      opacity="0.3"
      x="2rem"
      y="1rem"
      width="calc(100% - 4rem)"
      height="calc(100% - 2rem)"
      rx="10"
    />
  </ContentLoader>
);
const RepoSidebarListFallback = () => (
  <ContentLoader
    speed={1}
    width="100%"
    height="78rem"
    preserveAspectRatio="none"
    backgroundColor="rgba(150,150,150, 0.1)"
    foregroundColor="rgba(150,150,150, 0.1)"
  >
    <rect opacity="0.3" x="0" y="0" width="100%" height="7rem" rx="0" />
    <rect opacity="0.3" x="0" y="7.4rem" width="100%" height="7rem" rx="0" />
    <rect opacity="0.3" x="0" y="14.8rem" width="100%" height="7rem" rx="0" />
    <rect opacity="0.3" x="0" y="22.2rem" width="100%" height="7rem" rx="0" />
    <rect opacity="0.3" x="0" y="29.6rem" width="100%" height="7rem" rx="0" />
    <rect opacity="0.3" x="0" y="37rem" width="100%" height="7rem" rx="0" />
    <rect opacity="0.3" x="0" y="44.4rem" width="100%" height="7rem" rx="0" />
    <rect opacity="0.3" x="0" y="51.8rem" width="100%" height="7rem" rx="0" />
    <rect opacity="0.3" x="0" y="59.2rem" width="100%" height="7rem" rx="0" />
  </ContentLoader>
);
const IssuesListFallback = () => (
  <ContentLoader
    speed={1}
    width="100%"
    height="78rem"
    preserveAspectRatio="none"
    backgroundColor="rgba(150,150,150, 0.1)"
    foregroundColor="rgba(150,150,150, 0.1)"
  >
    <rect opacity="0.3" x="3.5rem" y="0" width="calc(100% - 7rem)" height="7rem" rx="0" />
    <rect opacity="0.3" x="3.5rem" y="7.4rem" width="calc(100% - 7rem)" height="7rem" rx="0" />
    <rect opacity="0.3" x="3.5rem" y="14.8rem" width="calc(100% - 7rem)" height="7rem" rx="0" />
    <rect opacity="0.3" x="3.5rem" y="22.2rem" width="calc(100% - 7rem)" height="7rem" rx="0" />
    <rect opacity="0.3" x="3.5rem" y="29.6rem" width="calc(100% - 7rem)" height="7rem" rx="0" />
    <rect opacity="0.3" x="3.5rem" y="37rem" width="calc(100% - 7rem)" height="7rem" rx="0" />
    <rect opacity="0.3" x="3.5rem" y="44.4rem" width="calc(100% - 7rem)" height="7rem" rx="0" />
    <rect opacity="0.3" x="3.5rem" y="51.8rem" width="calc(100% - 7rem)" height="7rem" rx="0" />
    <rect opacity="0.3" x="3.5rem" y="59.2rem" width="calc(100% - 7rem)" height="7rem" rx="0" />
  </ContentLoader>
);
const RepoStatsFallback = () => (
  <ContentLoader
    speed={1}
    width="100%"
    height="13.6rem"
    preserveAspectRatio="none"
    backgroundColor="rgba(150,150,150, 0.1)"
    foregroundColor="rgba(150,150,150, 0.1)"
  >
    <rect opacity="0.3" x="3.5rem" y="1rem" width="calc(100% - 7rem)" height="9rem" rx=".5rem" />
    <rect opacity="0.3" x="3.5rem" y="11rem" width="9.1rem" height="2.7rem" rx=".2rem" />
    <rect opacity="0.3" x="14.1rem" y="11rem" width="9.1rem" height="2.7rem" rx=".2rem" />
  </ContentLoader>
);

export {
  OverviewStatsErrorFallback,
  StarsOvertimeErrorFallback,
  DailyStarsErrorFallback,
  FiltersErrorFallback,
  StargazersListErrorFallback,
  ContributorsListErrorFallback,
  RepositoriesListErrorFallback,
  EfficiencyStatsErrorFallback,
  RepoSidebarListErrorFallback,
  IssuesListErrorFallback,
  RepoStatsErrorFallback,
  OverviewStatsFallback,
  StarsOvertimeFallback,
  DailyStarsFallback,
  FiltersFallback,
  StargazersListFallback,
  ContributorsListFallback,
  RepositoriesListFallback,
  EfficiencyStatsFallback,
  RepoSidebarListFallback,
  IssuesListFallback,
  RepoStatsFallback
};
