import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ActivityCard from '../components/ActivityCard';
import ActivityFilters from '../components/ActivityFilters';
import ScrollToTop from '../components/ScrollToTop';
import useDocumentMetadata from '../hooks/useDocumentMetadata';
import { apiRequest } from '../lib/api';
import { activityKey } from '../lib/activity';

const PAGE_SIZE = 6;

function readHashSlug(hash) {
  if (!hash || hash === '#') return '';
  try {
    return decodeURIComponent(hash.slice(1));
  } catch {
    return hash.slice(1);
  }
}

function ActivitySkeletons() {
  return (
    <div className="activity-feed__skeletons" aria-hidden="true">
      {[0, 1, 2].map((item) => (
        <div className="activity-skeleton" key={item}>
          <div className="activity-skeleton__header">
            <span className="activity-skeleton__avatar" />
            <span className="activity-skeleton__line activity-skeleton__line--short" />
          </div>
          <span className="activity-skeleton__line activity-skeleton__line--title" />
          <span className="activity-skeleton__line" />
          <span className="activity-skeleton__line activity-skeleton__line--medium" />
        </div>
      ))}
    </div>
  );
}

export default function ActivityPage() {
  useDocumentMetadata(
    'Muhammad Fasih | My Activity',
    'Updates on what Muhammad Fasih is building, learning, attending, and achieving.',
  );

  const location = useLocation();
  const navigate = useNavigate();
  const deepLinkSlug = useMemo(() => readHashSlug(location.hash), [location.hash]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activities, setActivities] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [feedStatus, setFeedStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [deepLinkError, setDeepLinkError] = useState('');
  const activeRequest = useRef(null);
  const requestSequence = useRef(0);
  const fetchedDeepLinks = useRef(new Set());

  const loadActivities = useCallback(async (category, requestedPage, append = false) => {
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;
    const sequence = ++requestSequence.current;

    if (append) {
      setIsLoadingMore(true);
      setErrorMessage('');
    } else {
      setFeedStatus('loading');
      setErrorMessage('');
    }

    const params = new URLSearchParams({
      page: String(requestedPage),
      limit: String(PAGE_SIZE),
    });
    if (category !== 'all') params.set('category', category);

    try {
      const result = await apiRequest(`/api/activities?${params.toString()}`, {
        signal: controller.signal,
      });
      if (sequence !== requestSequence.current) return;

      const nextActivities = Array.isArray(result?.activities) ? result.activities : [];
      const pagination = result?.pagination || {};

      setActivities((current) => {
        if (!append) return nextActivities;
        const existing = new Set(current.map(activityKey));
        return [...current, ...nextActivities.filter((activity) => !existing.has(activityKey(activity)))];
      });
      setPage(Number(pagination.page) || requestedPage);
      setTotal(Number(pagination.total) || nextActivities.length);
      setHasMore(Boolean(
        pagination.hasMore
        ?? ((Number(pagination.page) || requestedPage) < Number(pagination.totalPages || 1)),
      ));
      setFeedStatus('success');
      setErrorMessage('');
    } catch (error) {
      if (error.name === 'AbortError' || sequence !== requestSequence.current) return;
      if (!append) setFeedStatus('error');
      setErrorMessage(error.message);
    } finally {
      if (sequence === requestSequence.current) setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => loadActivities('all', 1), 0);
    return () => {
      window.clearTimeout(timeout);
      activeRequest.current?.abort();
    };
  }, [loadActivities]);

  useEffect(() => {
    if (!deepLinkSlug) return undefined;

    const target = activities.find((activity) => activity.slug === deepLinkSlug);
    if (target) {
      const frame = window.requestAnimationFrame(() => {
        const element = document.getElementById(deepLinkSlug);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element?.focus({ preventScroll: true });
      });
      return () => window.cancelAnimationFrame(frame);
    }

    if (feedStatus !== 'success' || fetchedDeepLinks.current.has(deepLinkSlug)) {
      return undefined;
    }

    fetchedDeepLinks.current.add(deepLinkSlug);
    const controller = new AbortController();
    apiRequest(`/api/activities/${encodeURIComponent(deepLinkSlug)}`, { signal: controller.signal })
      .then((result) => {
        const linkedActivity = result?.activity;
        if (!linkedActivity) throw new Error('This activity could not be found.');
        setActivities((current) => {
          if (current.some((activity) => activityKey(activity) === activityKey(linkedActivity))) {
            return current;
          }
          return [linkedActivity, ...current];
        });
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setDeepLinkError(error.status === 404
            ? 'The shared activity is no longer available.'
            : 'The shared activity could not be loaded.');
        }
      });

    return () => controller.abort();
  }, [activities, deepLinkSlug, feedStatus]);

  const handleFilterChange = (category) => {
    if (category === selectedCategory) return;
    setSelectedCategory(category);
    setDeepLinkError('');
    if (location.hash) navigate('/activity', { replace: true });
    loadActivities(category, 1);
  };

  const retry = () => loadActivities(selectedCategory, 1);

  return (
    <>
      <Navbar />
      <main className="activity-page">
        <header className="activity-page__header">
          <div className="activity-page__header-inner">
            <p className="activity-page__eyebrow">Updates &amp; progress</p>
            <h1>My Activity</h1>
            <p>Updates on what I’m building, learning, attending, and achieving.</p>
          </div>
        </header>

        <section className="activity-page__content" aria-labelledby="activity-feed-title">
          <h2 className="sr-only" id="activity-feed-title">Activity feed</h2>
          <ActivityFilters
            selected={selectedCategory}
            onChange={handleFilterChange}
            disabled={feedStatus === 'loading'}
          />

          {deepLinkError && (
            <p className="activity-feed__notice" role="status">{deepLinkError}</p>
          )}

          <div className="activity-feed" aria-busy={feedStatus === 'loading' || isLoadingMore}>
            {feedStatus === 'loading' && (
              <>
                <p className="sr-only" role="status">Loading activities…</p>
                <ActivitySkeletons />
              </>
            )}

            {feedStatus === 'error' && (
              <div className="activity-feed__state" role="alert">
                <h3>Activity feed unavailable</h3>
                <p>{errorMessage}</p>
                <button type="button" className="btn-primary" onClick={retry}>Try Again</button>
              </div>
            )}

            {feedStatus === 'success' && activities.length === 0 && (
              <div className="activity-feed__state activity-feed__state--empty">
                <span className="activity-feed__state-mark" aria-hidden="true">MF</span>
                <h3>No activities published yet.</h3>
                <p>New updates will appear here soon.</p>
              </div>
            )}

            {feedStatus === 'success' && activities.length > 0 && (
              <>
                <div className="activity-feed__list">
                  {activities.map((activity) => (
                    <ActivityCard
                      activity={activity}
                      isDeepLinked={activity.slug === deepLinkSlug}
                      key={activityKey(activity)}
                    />
                  ))}
                </div>

                <div className="activity-feed__pagination">
                  <p className="activity-feed__count" aria-live="polite">
                    Showing {Math.min(activities.length, total || activities.length)}
                    {total > 0 ? ` of ${total}` : ''} activities
                  </p>
                  {hasMore && (
                    <button
                      className="btn-secondary activity-feed__load-more"
                      type="button"
                      disabled={isLoadingMore}
                      onClick={() => loadActivities(selectedCategory, page + 1, true)}
                    >
                      {isLoadingMore ? 'Loading…' : 'Load More'}
                    </button>
                  )}
                  {isLoadingMore && <span className="sr-only" role="status">Loading more activities…</span>}
                  {errorMessage && isLoadingMore === false && hasMore && (
                    <p className="activity-feed__load-error" role="alert">{errorMessage}</p>
                  )}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
