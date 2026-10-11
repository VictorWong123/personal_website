export const DISCOVERY_IDS = ['dossier', 'archive', 'fieldNote', 'contact'];

export const DISCOVERY_TARGETS = {
    dossier: { id: 'dossier', label: 'Robot dossier', shortLabel: 'Dossier', location: 'overview' },
    archive: { id: 'archive', label: 'Project archive', shortLabel: 'Archive', location: 'archive' },
    fieldNote: { id: 'fieldNote', label: 'Companion field note', shortLabel: 'Field note', location: 'overview' },
    contact: { id: 'contact', label: 'Contact beacon', shortLabel: 'Contact', location: 'contact' },
};

export const LOCATIONS = ['overview', 'archive', 'contact'];

export const assertDiscoveryTarget = target => {
    if (!DISCOVERY_TARGETS[target]) {
        throw new Error(`Unknown discovery target: ${target}`);
    }
};

export const assertLocation = location => {
    if (!LOCATIONS.includes(location)) {
        throw new Error(`Unknown discovery location: ${location}`);
    }
};
