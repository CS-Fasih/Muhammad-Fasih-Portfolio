import { useEffect } from 'react';

export default function useDocumentMetadata(title, description) {
  useEffect(() => {
    const previousTitle = document.title;
    let descriptionTag = document.querySelector('meta[name="description"]');
    const previousDescription = descriptionTag?.getAttribute('content');
    const createdDescriptionTag = !descriptionTag;

    document.title = title;

    if (!descriptionTag) {
      descriptionTag = document.createElement('meta');
      descriptionTag.setAttribute('name', 'description');
      document.head.appendChild(descriptionTag);
    }
    descriptionTag.setAttribute('content', description);

    return () => {
      document.title = previousTitle;
      if (createdDescriptionTag) {
        descriptionTag.remove();
      } else if (previousDescription !== null && previousDescription !== undefined) {
        descriptionTag.setAttribute('content', previousDescription);
      }
    };
  }, [description, title]);
}
