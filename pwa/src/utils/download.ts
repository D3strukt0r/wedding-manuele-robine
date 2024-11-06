// https://learn.microsoft.com/en-us/previous-versions/hh772332(v=vs.85)#parameters

type MsSaveOrOpenBlobFunction = (blob: Blob, defaultName?: string, retVal?: boolean) => boolean;

export function downloadBlob(
  blob: BlobPart,
  mimeType: NonNullable<BlobPropertyBag['type']>,
  filename: HTMLAnchorElement['download'] | NonNullable<Parameters<MsSaveOrOpenBlobFunction>[1]>,
) {
  const newBlob = new Blob([blob], { type: mimeType });

  const navigator: Navigator & { msSaveOrOpenBlob?: MsSaveOrOpenBlobFunction } = window.navigator;
  if (navigator && typeof navigator.msSaveOrOpenBlob === 'function') {
    navigator.msSaveOrOpenBlob(newBlob, filename);

    return;
  }

  const data = window.URL.createObjectURL(newBlob);
  const link = document.createElement('a');

  document.body.appendChild(link);

  link.href = data;
  link.download = filename;
  link.click();

  setTimeout(() => {
    window.URL.revokeObjectURL(data);
    document.body.removeChild(link);
  }, 100);
}

export function getMimeType(response: Response) {
  return response.headers.get('Content-Type')?.match(/([^;]*)(.*)/)?.[1];
}

export function getFilename(response: Response) {
  // parse for filename*= / filename= occurrences
  const filename = response.headers.get('Content-Disposition')
    ?.match(/.*((filename="?([^"]*)"?(;|$))|(filename\*=[^']*'[^']*'([^;]*)(;|$)))/);

  return (filename?.[6] ? decodeURIComponent(filename?.[6]) : undefined) ?? (filename?.[3] ?? '');
}
