export const ACTIVITY_CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'Building', label: 'Building' },
  { value: 'Learning', label: 'Learning' },
  { value: 'Event', label: 'Events' },
  { value: 'Achievement', label: 'Achievements' },
  { value: 'Certification', label: 'Certifications' },
  { value: 'Open Source', label: 'Open Source' },
  { value: 'Experiment', label: 'Experiments' },
];

export const CATEGORY_VALUES = ACTIVITY_CATEGORIES
  .filter(({ value }) => value !== 'all')
  .map(({ value }) => value);

export const MAX_ACTIVITY_IMAGES = 4;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

export function activityKey(activity) {
  return activity?._id || activity?.id || activity?.slug;
}

export function formatActivityDate(value, options = {}) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options,
  }).format(date);
}

export function toDateTimeLocal(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 16);
}

export function isSafeExternalUrl(value) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function optimizedCloudinaryUrl(url, width = 1200) {
  if (typeof url !== 'string' || !url.includes('/image/upload/')) return url;
  return url.replace('/image/upload/', `/image/upload/f_auto,q_auto,c_limit,w_${width}/`);
}

export function activityShareUrl(activity) {
  const slug = activity?.slug || activityKey(activity);
  const base = `${window.location.origin}/activity`;
  return slug ? `${base}#${encodeURIComponent(slug)}` : base;
}

export function humanFileSize(bytes) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
