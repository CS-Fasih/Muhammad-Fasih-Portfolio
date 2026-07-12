import { useEffect, useRef, useState } from 'react';
import {
  ACCEPTED_IMAGE_TYPES,
  CATEGORY_VALUES,
  MAX_ACTIVITY_IMAGES,
  MAX_IMAGE_BYTES,
  humanFileSize,
  isSafeExternalUrl,
  toDateTimeLocal,
} from '../lib/activity';
import { apiRequest } from '../lib/api';

function initialValues(activity) {
  return {
    title: activity?.title || '',
    content: activity?.content || '',
    category: activity?.category || 'Building',
    occurredAt: toDateTimeLocal(activity?.occurredAt || activity?.activityDate),
    eventName: activity?.eventName || '',
    location: activity?.location || '',
    tags: Array.isArray(activity?.tags) ? activity.tags.join(', ') : '',
    externalLink: activity?.externalLink || '',
    externalLinkLabel: activity?.externalLinkLabel || '',
    status: activity?.status || 'draft',
    featured: Boolean(activity?.featured),
    images: Array.isArray(activity?.images) ? activity.images : [],
  };
}

function FieldError({ id, children }) {
  if (!children) return null;
  return <p className="form-field__error" id={id}>{children}</p>;
}

function normalizeServerErrors(details) {
  const errors = {};
  const addError = (field, message) => {
    if (typeof field !== 'string' || typeof message !== 'string') return;

    // The API reports nested image fields as, for example, "images.0.alt".
    // The form presents one shared error region for the image collection.
    const rootField = field.split(/[.[\]]/, 1)[0];
    const formField = rootField === 'activityDate' ? 'occurredAt' : rootField;
    if (!formField || !message.trim()) return;

    if (!errors[formField]) errors[formField] = message;
  };

  if (Array.isArray(details)) {
    details.forEach((detail) => addError(detail?.field, detail?.message));
    return errors;
  }
  if (!details || typeof details !== 'object') return errors;

  Object.entries(details).forEach(([field, value]) => {
    const message = Array.isArray(value) ? value[0] : value;
    addError(field, typeof message === 'string' ? message : String(message ?? ''));
  });
  return errors;
}

function defaultImageAlt(file, title, position) {
  const fileDescription = file.name
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const subject = title.trim() || fileDescription || 'Activity';
  return `${subject} — image ${position}`.slice(0, 200);
}

async function uploadToCloudinary(pendingImage) {
  const signature = await apiRequest('/api/uploads/sign', {
    method: 'POST',
    body: {
      fileName: pendingImage.file.name,
      fileSize: pendingImage.file.size,
      mimeType: pendingImage.file.type,
    },
  });

  const formData = new FormData();
  formData.append('file', pendingImage.file);
  formData.append('api_key', signature.apiKey);
  formData.append('signature', signature.signature);

  const uploadParams = signature.uploadParams || {
    timestamp: signature.timestamp,
    folder: signature.folder,
  };
  if (!uploadParams || typeof uploadParams !== 'object' || Array.isArray(uploadParams)) {
    throw new Error(`The upload could not be prepared for ${pendingImage.file.name}.`);
  }

  // Every parameter included in the signature must be sent unchanged or
  // Cloudinary will reject the request as having an invalid signature.
  Object.entries(uploadParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, Array.isArray(value) ? value.join(',') : String(value));
    }
  });

  const response = await fetch(
    signature.uploadUrl
      || `https://api.cloudinary.com/v1_1/${encodeURIComponent(signature.cloudName)}/image/upload`,
    { method: 'POST', body: formData },
  );
  const result = await response.json().catch(() => null);

  if (!response.ok || !result?.secure_url || !result?.public_id) {
    throw new Error(result?.error?.message || `Upload failed for ${pendingImage.file.name}.`);
  }

  return {
    url: result.secure_url,
    publicId: result.public_id,
    alt: pendingImage.alt.trim(),
  };
}

export default function ActivityForm({
  activity = null,
  onSaved,
  onCancel,
  onAuthRequired,
}) {
  const [values, setValues] = useState(() => initialValues(activity));
  const [pendingImages, setPendingImages] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formMessage, setFormMessage] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [submitStatus, setSubmitStatus] = useState('idle');
  const [isDraggingImages, setIsDraggingImages] = useState(false);
  const previewUrls = useRef(new Set());

  useEffect(() => {
    const urls = previewUrls.current;
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const isBusy = submitStatus === 'uploading' || submitStatus === 'saving';
  const imageCount = values.images.length + pendingImages.length;

  const updateField = (event) => {
    const { name, type, checked, value } = event.target;
    setValues((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
    if (fieldErrors[name]) {
      setFieldErrors((current) => ({ ...current, [name]: '' }));
    }
  };

  const updateExistingAlt = (index, alt) => {
    setValues((current) => ({
      ...current,
      images: current.images.map((image, imageIndex) => (
        imageIndex === index ? { ...image, alt } : image
      )),
    }));
    setFieldErrors((current) => ({ ...current, images: '' }));
  };

  const removeExistingImage = (index) => {
    setValues((current) => ({
      ...current,
      images: current.images.filter((_, imageIndex) => imageIndex !== index),
    }));
    setAnnouncement('Image removed from this activity. Save the activity to confirm the change.');
  };

  const updatePendingAlt = (id, alt) => {
    setPendingImages((current) => current.map((image) => (
      image.id === id ? { ...image, alt } : image
    )));
    setFieldErrors((current) => ({ ...current, images: '' }));
  };

  const removePendingImage = (id) => {
    setPendingImages((current) => {
      const removed = current.find((image) => image.id === id);
      if (removed) {
        URL.revokeObjectURL(removed.previewUrl);
        previewUrls.current.delete(removed.previewUrl);
      }
      return current.filter((image) => image.id !== id);
    });
    setAnnouncement('Selected image removed.');
  };

  const addFiles = (files) => {
    const selectedFiles = Array.from(files || []);
    if (selectedFiles.length === 0) return;

    const availableSlots = MAX_ACTIVITY_IMAGES - imageCount;
    const seenFiles = new Set(pendingImages.map(({ file }) => (
      `${file.name}:${file.size}:${file.lastModified}`
    )));
    const uniqueFiles = [];
    let duplicateCount = 0;

    selectedFiles.forEach((file) => {
      const key = `${file.name}:${file.size}:${file.lastModified}`;
      if (seenFiles.has(key)) {
        duplicateCount += 1;
        return;
      }
      seenFiles.add(key);
      uniqueFiles.push(file);
    });

    const unsupportedFiles = uniqueFiles.filter(
      (file) => !ACCEPTED_IMAGE_TYPES.includes(file.type),
    );
    const oversizedFiles = uniqueFiles.filter((file) => file.size > MAX_IMAGE_BYTES);
    const validFiles = uniqueFiles.filter((file) => (
      ACCEPTED_IMAGE_TYPES.includes(file.type) && file.size <= MAX_IMAGE_BYTES
    ));
    const filesToAdd = validFiles.slice(0, availableSlots);
    const capacitySkipped = Math.max(validFiles.length - filesToAdd.length, 0);

    if (filesToAdd.length === 0) {
      const message = availableSlots === 0
        ? `You can attach up to ${MAX_ACTIVITY_IMAGES} images. Remove an image before adding more.`
        : 'No supported images were selected. Use JPEG, PNG, WebP, or GIF files up to 5 MB each.';
      setFieldErrors((current) => ({ ...current, images: message }));
      setAnnouncement(message);
      return;
    }

    const timestamp = Date.now();
    const additions = filesToAdd.map((file, index) => {
      const previewUrl = URL.createObjectURL(file);
      previewUrls.current.add(previewUrl);
      return {
        id: `${timestamp}-${index}-${file.name}`,
        file,
        previewUrl,
        alt: defaultImageAlt(file, values.title, imageCount + index + 1),
      };
    });

    setPendingImages((current) => [...current, ...additions]);
    const issues = [];
    if (unsupportedFiles.length > 0) {
      issues.push(`${unsupportedFiles.length} unsupported ${unsupportedFiles.length === 1 ? 'file was' : 'files were'} skipped.`);
    }
    if (oversizedFiles.length > 0) {
      issues.push(`${oversizedFiles.length} ${oversizedFiles.length === 1 ? 'file was' : 'files were'} over ${humanFileSize(MAX_IMAGE_BYTES)} and skipped.`);
    }
    if (duplicateCount > 0) {
      issues.push(`${duplicateCount} duplicate ${duplicateCount === 1 ? 'image was' : 'images were'} skipped.`);
    }
    if (capacitySkipped > 0) {
      issues.push(`Only the first ${availableSlots} images that fit the ${MAX_ACTIVITY_IMAGES}-image limit were added.`);
    }
    setFieldErrors((current) => ({ ...current, images: issues.join(' ') }));
    setAnnouncement(
      `${additions.length} ${additions.length === 1 ? 'image was' : 'images were'} selected together and are ready to upload when you save.${issues.length > 0 ? ` ${issues.join(' ')}` : ''}`,
    );
  };

  const handleFiles = (event) => {
    addFiles(event.target.files);
    event.target.value = '';
  };

  const handleImageDrop = (event) => {
    event.preventDefault();
    setIsDraggingImages(false);
    if (!isBusy) addFiles(event.dataTransfer.files);
  };

  const validate = () => {
    const errors = {};
    const tags = values.tags.split(',').map((tag) => tag.trim()).filter(Boolean);

    if (!values.title.trim()) errors.title = 'Title is required.';
    if (values.title.trim().length === 1) errors.title = 'Title must be at least 2 characters.';
    if (values.title.trim().length > 160) errors.title = 'Title must be 160 characters or fewer.';
    if (!values.content.trim()) errors.content = 'Content is required.';
    if (values.content.trim().length === 1) errors.content = 'Content must be at least 2 characters.';
    if (values.content.trim().length > 12_000) errors.content = 'Content must be 12,000 characters or fewer.';
    if (!CATEGORY_VALUES.includes(values.category)) errors.category = 'Choose a valid category.';
    if (!values.occurredAt) errors.occurredAt = 'Activity date is required.';
    if (values.occurredAt && Number.isNaN(new Date(values.occurredAt).getTime())) {
      errors.occurredAt = 'Enter a valid activity date.';
    }
    if (!isSafeExternalUrl(values.externalLink.trim())) {
      errors.externalLink = 'Enter a complete http:// or https:// URL.';
    }
    if (values.externalLink.trim().length > 2048) errors.externalLink = 'External URL is too long.';
    if (values.externalLinkLabel.trim() && !values.externalLink.trim()) {
      errors.externalLink = 'Add an external URL for this link label.';
    }
    if (tags.length > 12) errors.tags = 'Use no more than 12 tags.';
    if (tags.some((tag) => tag.length > 40)) errors.tags = 'Each tag must be 40 characters or fewer.';
    if (values.eventName.trim().length > 160) errors.eventName = 'Event name must be 160 characters or fewer.';
    if (values.location.trim().length > 160) errors.location = 'Location must be 160 characters or fewer.';
    if (values.externalLinkLabel.trim().length > 80) {
      errors.externalLinkLabel = 'Link label must be 80 characters or fewer.';
    }

    const allImages = [...values.images, ...pendingImages];
    if (allImages.length > MAX_ACTIVITY_IMAGES) errors.images = 'Use no more than 4 images.';
    if (allImages.some((image) => !image.alt?.trim())) {
      errors.images = 'Add concise alternative text for every image.';
    }
    if (allImages.some((image) => image.alt?.trim().length > 200)) {
      errors.images = 'Image alternative text must be 200 characters or fewer.';
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setFormMessage('Review the highlighted fields and try again.');
      const firstInvalid = document.querySelector('.activity-form [aria-invalid="true"]');
      window.requestAnimationFrame(() => firstInvalid?.focus());
      return null;
    }

    return tags;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isBusy) return;

    setFormMessage('');
    setAnnouncement('');
    const tags = validate();
    if (!tags) return;

    let uploadedImages = [];
    if (pendingImages.length > 0) {
      setSubmitStatus('uploading');
      setAnnouncement(`Uploading ${pendingImages.length} ${pendingImages.length === 1 ? 'image' : 'images'}…`);

      const results = await Promise.allSettled(pendingImages.map(uploadToCloudinary));
      const successfulIds = new Set();
      const failedImages = [];
      let sessionExpired = false;

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          uploadedImages.push(result.value);
          successfulIds.add(pendingImages[index].id);
          URL.revokeObjectURL(pendingImages[index].previewUrl);
          previewUrls.current.delete(pendingImages[index].previewUrl);
        } else {
          failedImages.push(pendingImages[index]);
          if (result.reason?.status === 401) sessionExpired = true;
        }
      });

      if (uploadedImages.length > 0) {
        setValues((current) => ({ ...current, images: [...current.images, ...uploadedImages] }));
        setPendingImages((current) => current.filter((image) => !successfulIds.has(image.id)));
      }

      if (sessionExpired) {
        setSubmitStatus('idle');
        setAnnouncement('Your administrator session expired. Sign in again to continue.');
        onAuthRequired?.();
        return;
      }

      if (failedImages.length > 0) {
        setSubmitStatus('idle');
        setFormMessage(
          `${failedImages.length} ${failedImages.length === 1 ? 'image could' : 'images could'} not be uploaded. Successfully uploaded images were preserved; try saving again.`,
        );
        setAnnouncement('Image upload was only partially completed.');
        return;
      }
    }

    setSubmitStatus('saving');
    setAnnouncement(activity ? 'Saving activity changes…' : 'Creating activity…');

    try {
      const finalImages = [...values.images, ...uploadedImages];
      const payload = {
        title: values.title.trim(),
        content: values.content.trim(),
        category: values.category,
        occurredAt: new Date(values.occurredAt).toISOString(),
        eventName: values.eventName.trim(),
        location: values.location.trim(),
        tags,
        externalLink: values.externalLink.trim(),
        externalLinkLabel: values.externalLinkLabel.trim(),
        status: values.status,
        featured: values.featured,
        images: finalImages.map((image) => ({
          url: image.url,
          publicId: image.publicId,
          alt: image.alt.trim(),
        })),
      };
      const identifier = activity?._id || activity?.id || activity?.slug;
      const result = await apiRequest(
        identifier ? `/api/activities/${encodeURIComponent(identifier)}` : '/api/activities',
        { method: identifier ? 'PATCH' : 'POST', body: payload },
      );
      setSubmitStatus('success');
      setAnnouncement(activity ? 'Activity updated successfully.' : 'Activity created successfully.');
      onSaved?.(result?.activity, {
        warning: result?.warning || '',
        cleanupPending: Number(result?.cleanupPending) || 0,
      });
    } catch (error) {
      setSubmitStatus('idle');
      if (error.status === 401) {
        setAnnouncement('Your administrator session expired. Sign in again to continue.');
        onAuthRequired?.();
        return;
      }

      const serverErrors = normalizeServerErrors(error.details);
      setFieldErrors((current) => ({ ...current, ...serverErrors }));
      setFormMessage(error.message);
      setAnnouncement('The activity was not saved. Your form data has been preserved.');
      if (Object.keys(serverErrors).length > 0) {
        window.requestAnimationFrame(() => {
          document.querySelector('.activity-form [aria-invalid="true"]')?.focus();
        });
      }
    }
  };

  return (
    <form className="activity-form" onSubmit={handleSubmit} noValidate>
      <div className="activity-form__heading">
        <div>
          <p className="activity-form__eyebrow">{activity ? 'Edit post' : 'New post'}</p>
          <h2>{activity ? 'Update Activity' : 'Create Activity'}</h2>
        </div>
        {onCancel && (
          <button className="activity-form__close" type="button" onClick={onCancel} disabled={isBusy} aria-label="Close activity form">
            ×
          </button>
        )}
      </div>

      {formMessage && <p className="form-message form-message--error" role="alert">{formMessage}</p>}
      <p className="sr-only" role="status" aria-live="polite">{announcement}</p>

      <div className="activity-form__grid">
        <div className="form-field activity-form__field--wide">
          <label htmlFor="activity-title">Title <span aria-hidden="true">*</span></label>
          <input
            id="activity-title"
            name="title"
            type="text"
            maxLength="160"
            value={values.title}
            onChange={updateField}
            aria-invalid={Boolean(fieldErrors.title)}
            aria-describedby={fieldErrors.title ? 'activity-title-error' : undefined}
            required
          />
          <div className="form-field__meta">
            <FieldError id="activity-title-error">{fieldErrors.title}</FieldError>
            <span>{values.title.length}/160</span>
          </div>
        </div>

        <div className="form-field activity-form__field--wide">
          <label htmlFor="activity-content">Content <span aria-hidden="true">*</span></label>
          <textarea
            id="activity-content"
            name="content"
            rows="8"
            maxLength="12000"
            value={values.content}
            onChange={updateField}
            aria-invalid={Boolean(fieldErrors.content)}
            aria-describedby={fieldErrors.content ? 'activity-content-error' : undefined}
            required
          />
          <div className="form-field__meta">
            <FieldError id="activity-content-error">{fieldErrors.content}</FieldError>
            <span>{values.content.length}/12,000</span>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="activity-category">Category <span aria-hidden="true">*</span></label>
          <select
            id="activity-category"
            name="category"
            value={values.category}
            onChange={updateField}
            aria-invalid={Boolean(fieldErrors.category)}
            aria-describedby={fieldErrors.category ? 'activity-category-error' : undefined}
          >
            {CATEGORY_VALUES.map((category) => <option key={category}>{category}</option>)}
          </select>
          <FieldError id="activity-category-error">{fieldErrors.category}</FieldError>
        </div>

        <div className="form-field">
          <label htmlFor="activity-date">Activity date <span aria-hidden="true">*</span></label>
          <input
            id="activity-date"
            name="occurredAt"
            type="datetime-local"
            value={values.occurredAt}
            onChange={updateField}
            aria-invalid={Boolean(fieldErrors.occurredAt)}
            aria-describedby={fieldErrors.occurredAt ? 'activity-date-error' : undefined}
            required
          />
          <FieldError id="activity-date-error">{fieldErrors.occurredAt}</FieldError>
        </div>

        <div className="form-field">
          <label htmlFor="activity-event">Event name</label>
          <input
            id="activity-event"
            name="eventName"
            type="text"
            maxLength="160"
            value={values.eventName}
            onChange={updateField}
            aria-invalid={Boolean(fieldErrors.eventName)}
            aria-describedby={fieldErrors.eventName ? 'activity-event-error' : undefined}
          />
          <FieldError id="activity-event-error">{fieldErrors.eventName}</FieldError>
        </div>

        <div className="form-field">
          <label htmlFor="activity-location">Location</label>
          <input
            id="activity-location"
            name="location"
            type="text"
            maxLength="160"
            value={values.location}
            onChange={updateField}
            aria-invalid={Boolean(fieldErrors.location)}
            aria-describedby={fieldErrors.location ? 'activity-location-error' : undefined}
          />
          <FieldError id="activity-location-error">{fieldErrors.location}</FieldError>
        </div>

        <div className="form-field activity-form__field--wide">
          <label htmlFor="activity-tags">Tags</label>
          <input
            id="activity-tags"
            name="tags"
            type="text"
            value={values.tags}
            onChange={updateField}
            placeholder="React, AI, Open Source"
            aria-invalid={Boolean(fieldErrors.tags)}
            aria-describedby="activity-tags-help activity-tags-error"
          />
          <p className="form-field__help" id="activity-tags-help">Separate up to 12 tags with commas.</p>
          <FieldError id="activity-tags-error">{fieldErrors.tags}</FieldError>
        </div>

        <div className="form-field">
          <label htmlFor="activity-link">External link</label>
          <input
            id="activity-link"
            name="externalLink"
            type="url"
            value={values.externalLink}
            onChange={updateField}
            placeholder="https://"
            aria-invalid={Boolean(fieldErrors.externalLink)}
            aria-describedby={fieldErrors.externalLink ? 'activity-link-error' : undefined}
          />
          <FieldError id="activity-link-error">{fieldErrors.externalLink}</FieldError>
        </div>

        <div className="form-field">
          <label htmlFor="activity-link-label">Link label</label>
          <input
            id="activity-link-label"
            name="externalLinkLabel"
            type="text"
            value={values.externalLinkLabel}
            onChange={updateField}
            placeholder="View Project"
            maxLength="80"
            aria-invalid={Boolean(fieldErrors.externalLinkLabel)}
            aria-describedby={fieldErrors.externalLinkLabel ? 'activity-link-label-error' : undefined}
          />
          <FieldError id="activity-link-label-error">{fieldErrors.externalLinkLabel}</FieldError>
        </div>

        <div className="form-field">
          <label htmlFor="activity-status">Status</label>
          <select id="activity-status" name="status" value={values.status} onChange={updateField}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="form-field form-field--checkbox">
          <input id="activity-featured" name="featured" type="checkbox" checked={values.featured} onChange={updateField} />
          <label htmlFor="activity-featured">Feature this activity</label>
        </div>
      </div>

      <fieldset
        className="activity-form__images"
        aria-describedby={fieldErrors.images ? 'activity-images-error' : undefined}
        aria-invalid={Boolean(fieldErrors.images)}
        tabIndex={fieldErrors.images ? -1 : undefined}
      >
        <legend>Images <span>{imageCount}/{MAX_ACTIVITY_IMAGES}</span></legend>
        <p>
          Select several images together. On desktop use Ctrl/Shift, or drag files here;
          on mobile choose Select multiple in your gallery. Maximum 5 MB per image.
        </p>

        {(values.images.length > 0 || pendingImages.length > 0) && (
          <ul className="activity-form__image-list">
            {values.images.map((image, index) => (
              <li className="activity-form__image-item" key={image.publicId || image.url}>
                <img src={image.url} alt="" />
                <div className="form-field">
                  <label htmlFor={`existing-image-alt-${index}`}>Image {index + 1} alt text</label>
                  <input
                    id={`existing-image-alt-${index}`}
                    type="text"
                    value={image.alt || ''}
                    onChange={(event) => updateExistingAlt(index, event.target.value)}
                    aria-invalid={Boolean(fieldErrors.images && !image.alt?.trim())}
                  />
                </div>
                <button type="button" className="activity-form__remove-image" onClick={() => removeExistingImage(index)} disabled={isBusy}>
                  Remove
                </button>
              </li>
            ))}

            {pendingImages.map((image, index) => (
              <li className="activity-form__image-item activity-form__image-item--pending" key={image.id}>
                <div className="activity-form__pending-preview">
                  <img src={image.previewUrl} alt="" />
                  <span>Ready to upload</span>
                </div>
                <div className="form-field">
                  <label htmlFor={`pending-image-alt-${image.id}`}>
                    Image {values.images.length + index + 1} alt text
                  </label>
                  <input
                    id={`pending-image-alt-${image.id}`}
                    type="text"
                    value={image.alt}
                    onChange={(event) => updatePendingAlt(image.id, event.target.value)}
                    aria-invalid={Boolean(fieldErrors.images && !image.alt.trim())}
                  />
                </div>
                <button type="button" className="activity-form__remove-image" onClick={() => removePendingImage(image.id)} disabled={isBusy}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        {imageCount < MAX_ACTIVITY_IMAGES && (
          <label
            className={`activity-form__file-button${isDraggingImages ? ' is-dragging' : ''}`}
            htmlFor="activity-images"
            onDragEnter={(event) => {
              event.preventDefault();
              if (!isBusy) setIsDraggingImages(true);
            }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setIsDraggingImages(false);
              }
            }}
            onDrop={handleImageDrop}
          >
            <span>Select Images Together</span>
            <small>{MAX_ACTIVITY_IMAGES - imageCount} remaining · drag and drop supported</small>
            <input
              id="activity-images"
              type="file"
              accept={ACCEPTED_IMAGE_TYPES.join(',')}
              multiple
              onChange={handleFiles}
              disabled={isBusy}
            />
          </label>
        )}
        <FieldError id="activity-images-error">{fieldErrors.images}</FieldError>
      </fieldset>

      <div className="activity-form__actions">
        {onCancel && (
          <button className="btn-secondary" type="button" onClick={onCancel} disabled={isBusy}>Cancel</button>
        )}
        <button className="btn-primary" type="submit" disabled={isBusy}>
          {submitStatus === 'uploading' && 'Uploading Images…'}
          {submitStatus === 'saving' && 'Saving…'}
          {!isBusy && (activity ? 'Save Changes' : 'Create Activity')}
        </button>
      </div>
    </form>
  );
}
