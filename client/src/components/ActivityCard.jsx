import { useEffect, useRef, useState } from 'react';
import { apiRequest } from '../lib/api';
import {
  activityKey,
  activityShareUrl,
  formatActivityDate,
  isSafeExternalUrl,
  optimizedCloudinaryUrl,
} from '../lib/activity';

const COLLAPSIBLE_CONTENT_LENGTH = 260;
const COLLAPSIBLE_CONTENT_LINES = 4;
async function copyText(value) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textArea = document.createElement('textarea');
  textArea.value = value;
  textArea.setAttribute('readonly', '');
  textArea.className = 'activity-card__copy-helper';
  document.body.appendChild(textArea);
  textArea.select();
  const copied = document.execCommand('copy');
  textArea.remove();
  if (!copied) throw new Error('Copy failed');
}

function ExternalLink({ activity }) {
  if (!activity.externalLink || !isSafeExternalUrl(activity.externalLink)) return null;

  let fallbackLabel = 'Read More';
  if (activity.eventName || activity.category === 'Event') fallbackLabel = 'View Event';
  if (activity.category === 'Building' || activity.category === 'Open Source') {
    fallbackLabel = 'View Project';
  }

  return (
    <a
      className="activity-card__external-link"
      href={activity.externalLink}
      target="_blank"
      rel="noopener noreferrer"
    >
      {activity.externalLinkLabel || fallbackLabel}
      <span aria-hidden="true"> ↗</span>
    </a>
  );
}

function ActivityImages({ images, title }) {
  if (!Array.isArray(images) || images.length === 0) return null;

  const visibleImages = images.slice(0, 4);
  return (
    <div
      className={`activity-card__images activity-card__images--${visibleImages.length}`}
      aria-label={`${visibleImages.length} ${visibleImages.length === 1 ? 'image' : 'images'} attached to this activity`}
    >
      {visibleImages.map((image, index) => {
        const source = optimizedCloudinaryUrl(image.url, visibleImages.length === 1 ? 1400 : 800);
        return (
          <a
            className="activity-card__image-link"
            href={image.url}
            target="_blank"
            rel="noopener noreferrer"
            key={image.publicId || image.url}
            aria-label={`Open image ${index + 1} in a new tab`}
          >
            <img
              className="activity-card__image"
              src={source}
              alt={image.alt || `${title} — image ${index + 1}`}
              loading="lazy"
              decoding="async"
            />
          </a>
        );
      })}
    </div>
  );
}

export default function ActivityCard({ activity, isDeepLinked = false }) {
  const [shareStatus, setShareStatus] = useState('');
  const [isContentExpanded, setIsContentExpanded] = useState(isDeepLinked);
  const cardKey = activityKey(activity);
  const [loveCount, setLoveCount] = useState(Math.max(0, activity.loves || 0));
  const [isLoved, setIsLoved] = useState(() => Boolean(activity.viewerLoved));
  const [isLoving, setIsLoving] = useState(false);
  const loveRequestInFlight = useRef(false);
  const anchor = activity.slug || activityKey(activity);
  const occurredAt = activity.occurredAt || activity.activityDate;
  const content = String(activity.content || '');
  const contentLines = content.split('\n');
  const canToggleContent = content.length > COLLAPSIBLE_CONTENT_LENGTH
    || contentLines.length > COLLAPSIBLE_CONTENT_LINES;
  const contentId = `activity-content-${cardKey}`;
  const updated = activity.updatedAt && activity.createdAt
    && new Date(activity.updatedAt).getTime() > new Date(activity.createdAt).getTime() + 1000;

  useEffect(() => {
    if (!shareStatus) return undefined;
    const timeout = window.setTimeout(() => setShareStatus(''), 2500);
    return () => window.clearTimeout(timeout);
  }, [shareStatus]);

  const handleShare = async () => {
    const url = activityShareUrl(activity);
    setShareStatus('');

    if (navigator.share) {
      try {
        await navigator.share({ title: activity.title, text: activity.title, url });
        setShareStatus('Shared');
        return;
      } catch (error) {
        if (error.name === 'AbortError') return;
      }
    }

    try {
      await copyText(url);
      setShareStatus('Link copied');
    } catch {
      setShareStatus('Unable to copy link');
    }
  };

  const handleLove = async () => {
    if (loveRequestInFlight.current) return;
    loveRequestInFlight.current = true;
    const wasLoved = isLoved;
    const nextLoved = !wasLoved;
    setIsLoving(true);
    setIsLoved(nextLoved);
    setLoveCount((count) => Math.max(0, count + (nextLoved ? 1 : -1)));

    try {
      const result = await apiRequest(`/api/activities/${encodeURIComponent(cardKey)}`, {
        method: 'POST',
        body: { action: nextLoved ? 'love' : 'unlike' },
      });
      setIsLoved(result.loved);
      setLoveCount(result.loves);
    } catch {
      setIsLoved(wasLoved);
      setLoveCount((count) => Math.max(0, count + (nextLoved ? -1 : 1)));
    } finally {
      loveRequestInFlight.current = false;
      setIsLoving(false);
    }
  };

  return (
    <article
      className={`activity-card${activity.featured ? ' activity-card--featured' : ''}${isDeepLinked ? ' activity-card--targeted' : ''}`}
      id={anchor ? String(anchor) : undefined}
      tabIndex={isDeepLinked ? -1 : undefined}
      aria-labelledby={`activity-title-${cardKey}`}
    >
      <header className="activity-card__header">
        <div className="activity-card__avatar" aria-hidden="true">MF</div>
        <div className="activity-card__author">
          <p className="activity-card__author-name">Muhammad Fasih</p>
          <div className="activity-card__meta">
            <span className="activity-card__category">{activity.category}</span>
            {occurredAt && (
              <>
                <span aria-hidden="true">•</span>
                <time dateTime={new Date(occurredAt).toISOString()}>
                  {formatActivityDate(occurredAt)}
                </time>
              </>
            )}
          </div>
        </div>
        {activity.featured && <span className="activity-card__featured">Featured</span>}
      </header>

      <div className="activity-card__body">
        <h2 className="activity-card__title" id={`activity-title-${cardKey}`}>
          {activity.title}
        </h2>
        <p
          className={`activity-card__content${canToggleContent && !isContentExpanded ? ' is-collapsed' : ''}`}
          id={contentId}
        >
          {contentLines.map((line, index, lines) => (
            <span key={`${index}-${line.slice(0, 20)}`}>
              {line}
              {index < lines.length - 1 && <br />}
            </span>
          ))}
        </p>
        {canToggleContent && (
          <button
            className="activity-card__content-toggle"
            type="button"
            aria-controls={contentId}
            aria-expanded={isContentExpanded}
            onClick={() => setIsContentExpanded((expanded) => !expanded)}
          >
            {isContentExpanded ? 'Show less' : 'Show more'}
            <span aria-hidden="true">{isContentExpanded ? ' ↑' : ' ↓'}</span>
          </button>
        )}

        {(activity.eventName || activity.location) && (
          <dl className="activity-card__details">
            {activity.eventName && (
              <div className="activity-card__detail">
                <dt>Event</dt>
                <dd>{activity.eventName}</dd>
              </div>
            )}
            {activity.location && (
              <div className="activity-card__detail">
                <dt>Location</dt>
                <dd>{activity.location}</dd>
              </div>
            )}
          </dl>
        )}

        <ActivityImages images={activity.images} title={activity.title} />

        {Array.isArray(activity.tags) && activity.tags.length > 0 && (
          <ul className="activity-card__tags" aria-label="Topics">
            {activity.tags.map((tag) => (
              <li className="activity-card__tag" key={tag}>#{tag}</li>
            ))}
          </ul>
        )}

        <ExternalLink activity={activity} />
      </div>

      <footer className="activity-card__footer">
        <p className="activity-card__timestamps">
          {activity.createdAt && (
            <span>
              Posted <time dateTime={new Date(activity.createdAt).toISOString()}>{formatActivityDate(activity.createdAt, { month: 'short' })}</time>
            </span>
          )}
          {updated && (
            <span>
              Updated <time dateTime={new Date(activity.updatedAt).toISOString()}>{formatActivityDate(activity.updatedAt, { month: 'short' })}</time>
            </span>
          )}
        </p>
        <div className="activity-card__actions">
          <button
            className={`activity-card__love${isLoved ? ' is-loved' : ''}`}
            type="button"
            aria-label={isLoved ? `Loved. ${loveCount} loves` : `Love this post. ${loveCount} loves`}
            aria-pressed={isLoved}
            disabled={isLoving}
            onClick={handleLove}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
            </svg>
            <span>{loveCount}</span>
          </button>
          <div className="activity-card__share-wrap">
          <button className="activity-card__share" type="button" onClick={handleShare}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4" />
            </svg>
            Share
          </button>
          <span className="activity-card__share-status" role="status" aria-live="polite">
            {shareStatus}
          </span>
          </div>
        </div>
      </footer>
    </article>
  );
}
