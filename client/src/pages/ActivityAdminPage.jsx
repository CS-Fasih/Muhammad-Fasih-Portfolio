import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ActivityForm from '../components/ActivityForm';
import useDocumentMetadata from '../hooks/useDocumentMetadata';
import { apiRequest } from '../lib/api';
import { activityKey, formatActivityDate } from '../lib/activity';

const ADMIN_PAGE_SIZE = 20;

export default function ActivityAdminPage() {
  useDocumentMetadata(
    'Manage Activity | Muhammad Fasih',
    'Private activity publishing dashboard for Muhammad Fasih.',
  );

  const navigate = useNavigate();
  const location = useLocation();
  const formRegion = useRef(null);
  const activeRequest = useRef(null);
  const requestSequence = useRef(0);
  const [activities, setActivities] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [listStatus, setListStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [warningMessage, setWarningMessage] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [actionId, setActionId] = useState('');
  const [editingActivity, setEditingActivity] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const returnToLogin = useCallback(() => {
    navigate('/admin/login', { replace: true, state: { from: location.pathname } });
  }, [location.pathname, navigate]);

  const loadActivities = useCallback(async (requestedPage = 1, append = false) => {
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;
    const sequence = ++requestSequence.current;

    if (append) {
      setIsLoadingMore(true);
      setErrorMessage('');
    }
    else {
      setListStatus('loading');
      setErrorMessage('');
    }

    const params = new URLSearchParams({
      admin: 'true',
      page: String(requestedPage),
      limit: String(ADMIN_PAGE_SIZE),
    });

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
        return [...current, ...nextActivities.filter((item) => !existing.has(activityKey(item)))];
      });
      setPage(Number(pagination.page) || requestedPage);
      setTotal(Number(pagination.total) || nextActivities.length);
      setHasMore(Boolean(
        pagination.hasMore
        ?? ((Number(pagination.page) || requestedPage) < Number(pagination.totalPages || 1)),
      ));
      setListStatus('success');
      setErrorMessage('');
    } catch (error) {
      if (error.name === 'AbortError' || sequence !== requestSequence.current) return;
      if (error.status === 401) {
        returnToLogin();
        return;
      }
      if (!append) setListStatus('error');
      setErrorMessage(error.message);
    } finally {
      if (sequence === requestSequence.current) setIsLoadingMore(false);
    }
  }, [returnToLogin]);

  useEffect(() => {
    const timeout = window.setTimeout(() => loadActivities(), 0);
    return () => {
      window.clearTimeout(timeout);
      activeRequest.current?.abort();
    };
  }, [loadActivities]);

  const openForm = (activity = null) => {
    setEditingActivity(activity);
    setShowForm(true);
    setErrorMessage('');
    setWarningMessage('');
    window.requestAnimationFrame(() => {
      formRegion.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingActivity(null);
  };

  const handleSaved = (savedActivity, resultMeta = {}) => {
    closeForm();
    const successMessage = (
      savedActivity?.title
        ? `“${savedActivity.title}” was saved successfully.`
        : 'Activity saved successfully.'
    );
    const cleanupWarning = resultMeta.warning || (resultMeta.cleanupPending
      ? `${resultMeta.cleanupPending} removed ${resultMeta.cleanupPending === 1 ? 'image still needs' : 'images still need'} cleanup.`
      : '');
    setAnnouncement(cleanupWarning
      ? `${successMessage} ${cleanupWarning}`
      : successMessage);
    setWarningMessage(cleanupWarning);
    loadActivities(1);
  };

  const patchActivity = async (activity, changes, successMessage) => {
    const id = activityKey(activity);
    setActionId(id);
    setErrorMessage('');
    setWarningMessage('');
    try {
      const result = await apiRequest(`/api/activities/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: changes,
      });
      const updatedActivity = result?.activity;
      setActivities((current) => current.map((item) => (
        activityKey(item) === id ? updatedActivity || { ...item, ...changes } : item
      )));
      const cleanupWarning = result?.warning || (result?.cleanupPending
        ? `${result.cleanupPending} removed ${result.cleanupPending === 1 ? 'image still needs' : 'images still need'} cleanup.`
        : '');
      setAnnouncement(cleanupWarning ? `${successMessage} ${cleanupWarning}` : successMessage);
      setWarningMessage(cleanupWarning);
      if (editingActivity && activityKey(editingActivity) === id && updatedActivity) {
        setEditingActivity(updatedActivity);
      }
      loadActivities(1);
    } catch (error) {
      if (error.status === 401) {
        returnToLogin();
        return;
      }
      setErrorMessage(error.message);
    } finally {
      setActionId('');
    }
  };

  const deleteActivity = async (activity) => {
    const confirmed = window.confirm(
      `Delete “${activity.title}”? Its Cloudinary images will also be removed. This cannot be undone.`,
    );
    if (!confirmed) return;

    const id = activityKey(activity);
    setActionId(id);
    setErrorMessage('');
    setWarningMessage('');
    try {
      await apiRequest(`/api/activities/${encodeURIComponent(id)}`, { method: 'DELETE' });
      setActivities((current) => current.filter((item) => activityKey(item) !== id));
      setTotal((current) => Math.max(0, current - 1));
      if (editingActivity && activityKey(editingActivity) === id) closeForm();
      setAnnouncement(`“${activity.title}” was deleted.`);
      loadActivities(1);
    } catch (error) {
      if (error.status === 401) {
        returnToLogin();
        return;
      }
      setErrorMessage(error.message);
    } finally {
      setActionId('');
    }
  };

  const handleLogout = async () => {
    setActionId('logout');
    setErrorMessage('');
    setWarningMessage('');
    try {
      await apiRequest('/api/auth/logout', { method: 'POST' });
      navigate('/admin/login', { replace: true });
    } catch (error) {
      if (error.status === 401) {
        navigate('/admin/login', { replace: true });
        return;
      }
      setErrorMessage(error.message);
      setActionId('');
    }
  };

  return (
    <main className="activity-admin">
      <header className="activity-admin__header">
        <div className="activity-admin__header-inner">
          <div>
            <Link className="activity-admin__brand" to="/">Muhammad <span>Fasih</span></Link>
            <p className="activity-admin__eyebrow">Private dashboard</p>
            <h1>Activity Management</h1>
          </div>
          <div className="activity-admin__header-actions">
            <Link className="btn-secondary" to="/activity" target="_blank" rel="noopener noreferrer">View Public Feed</Link>
            <button className="btn-secondary" type="button" onClick={handleLogout} disabled={actionId === 'logout'}>
              {actionId === 'logout' ? 'Signing Out…' : 'Sign Out'}
            </button>
          </div>
        </div>
      </header>

      <div className="activity-admin__content">
        <section className="activity-admin__toolbar" aria-labelledby="activity-list-title">
          <div>
            <p className="activity-admin__count">{total} {total === 1 ? 'activity' : 'activities'}</p>
            <h2 id="activity-list-title">All Posts</h2>
          </div>
          <button className="btn-primary" type="button" onClick={() => openForm()} disabled={showForm && !editingActivity}>
            + Create Activity
          </button>
        </section>

        <p className="sr-only" role="status" aria-live="polite">{announcement}</p>
        {errorMessage && listStatus !== 'error' && (
          <div className="activity-admin__alert" role="alert">
            <p>{errorMessage}</p>
            <button type="button" onClick={() => setErrorMessage('')} aria-label="Dismiss error">×</button>
          </div>
        )}
        {warningMessage && (
          <div className="activity-admin__alert" role="status">
            <p>{warningMessage}</p>
            <button type="button" onClick={() => setWarningMessage('')} aria-label="Dismiss warning">×</button>
          </div>
        )}

        <div className="activity-admin__form-region" ref={formRegion}>
          {showForm && (
            <ActivityForm
              activity={editingActivity}
              key={editingActivity ? activityKey(editingActivity) : 'new-activity'}
              onSaved={handleSaved}
              onCancel={closeForm}
              onAuthRequired={returnToLogin}
            />
          )}
        </div>

        <section className="activity-admin__list-section" aria-label="Saved activities">
          {listStatus === 'loading' && (
            <div className="activity-admin__loading" aria-busy="true">
              <span className="admin-spinner" aria-hidden="true" />
              <p role="status">Loading activities…</p>
            </div>
          )}

          {listStatus === 'error' && (
            <div className="activity-admin__state" role="alert">
              <h2>Activities could not be loaded</h2>
              <p>{errorMessage}</p>
              <button className="btn-primary" type="button" onClick={() => loadActivities(1)}>Try Again</button>
            </div>
          )}

          {listStatus === 'success' && activities.length === 0 && (
            <div className="activity-admin__state">
              <span aria-hidden="true">MF</span>
              <h2>No activities yet</h2>
              <p>Create the first activity as a draft, preview it, then publish when it is ready.</p>
              <button className="btn-primary" type="button" onClick={() => openForm()}>Create First Activity</button>
            </div>
          )}

          {listStatus === 'success' && activities.length > 0 && (
            <div className="activity-admin__list">
              {activities.map((activity) => {
                const id = activityKey(activity);
                const isWorking = actionId === id;
                return (
                  <article className="activity-admin-card" key={id}>
                    <div className="activity-admin-card__main">
                      {activity.images?.[0]?.url && (
                        <img
                          className="activity-admin-card__thumbnail"
                          src={activity.images[0].url}
                          alt=""
                          loading="lazy"
                        />
                      )}
                      <div className="activity-admin-card__content">
                        <div className="activity-admin-card__badges">
                          <span className={`activity-admin-card__status activity-admin-card__status--${activity.status}`}>
                            {activity.status}
                          </span>
                          <span>{activity.category}</span>
                          {activity.featured && <span className="activity-admin-card__featured">Featured</span>}
                        </div>
                        <h3>{activity.title}</h3>
                        <p className="activity-admin-card__excerpt">{activity.content}</p>
                        <p className="activity-admin-card__date">
                          Activity date: <time dateTime={activity.occurredAt}>{formatActivityDate(activity.occurredAt)}</time>
                          {activity.updatedAt && (
                            <> · Updated <time dateTime={activity.updatedAt}>{formatActivityDate(activity.updatedAt, { month: 'short' })}</time></>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="activity-admin-card__actions" aria-label={`Actions for ${activity.title}`}>
                      <button type="button" onClick={() => openForm(activity)} disabled={isWorking}>Edit</button>
                      <button
                        type="button"
                        onClick={() => patchActivity(
                          activity,
                          { status: activity.status === 'published' ? 'draft' : 'published' },
                          `“${activity.title}” is now ${activity.status === 'published' ? 'a draft' : 'published'}.`,
                        )}
                        disabled={isWorking}
                      >
                        {activity.status === 'published' ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        type="button"
                        onClick={() => patchActivity(
                          activity,
                          { featured: !activity.featured },
                          `“${activity.title}” was ${activity.featured ? 'unfeatured' : 'featured'}.`,
                        )}
                        disabled={isWorking}
                      >
                        {activity.featured ? 'Unfeature' : 'Feature'}
                      </button>
                      <button className="activity-admin-card__delete" type="button" onClick={() => deleteActivity(activity)} disabled={isWorking}>
                        {isWorking ? 'Working…' : 'Delete'}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {listStatus === 'success' && hasMore && (
            <div className="activity-admin__pagination">
              <button
                className="btn-secondary"
                type="button"
                onClick={() => loadActivities(page + 1, true)}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? 'Loading…' : 'Load More'}
              </button>
              {isLoadingMore && <span className="sr-only" role="status">Loading more activities…</span>}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
