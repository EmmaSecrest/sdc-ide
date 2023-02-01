import {
    extractBundleResources,
    getFHIRResources,
    getReference,
    ResourcesMap,
} from 'aidbox-react/lib/services/fhir';
import { SearchParams } from 'aidbox-react/lib/services/search';
import { mapSuccess } from 'aidbox-react/lib/services/service';

import { Resource } from 'shared/src/contrib/aidbox';

export async function loadResourceOptions<R extends Resource, IR extends Resource = any>(
    resourceType: R['resourceType'],
    searchParams: SearchParams,
    getDisplayFn: (resource: R, includedResources: ResourcesMap<R | IR>) => string,
) {
    return mapSuccess(await getFHIRResources<R | IR>(resourceType, searchParams), (bundle) => {
        const resourcesMap = extractBundleResources(bundle);
        return resourcesMap[resourceType].map((resource) => ({
            value: {
                Reference: {
                    ...getReference(resource, getDisplayFn(resource as R, resourcesMap)),
                    resource,
                },
            },
        }));
    });
}
