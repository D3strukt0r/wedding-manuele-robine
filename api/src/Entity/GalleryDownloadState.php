<?php declare(strict_types=1);

namespace App\Entity;

enum GalleryDownloadState: string
{
    case PENDING = 'pending';
    case CREATE_ZIP = 'create_zip';
    case DOWNLOADING = 'downloading'; // with extra info on how many of how many
    case CACHING = 'caching'; // uploading to remote location
    // case COMPLETED = 'completed'; // entity is deleted when completed
}
