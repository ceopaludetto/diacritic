import type { ResourceGraph } from "./resource";
import type { AsyncSubscription, Event } from "@parcel/watcher";

import { subscribe } from "@parcel/watcher";

type WatchResourcesOptions = {
	resourceGraph: ResourceGraph;
	resources: string[];
	onChange?: (event?: Event) => Promise<void>;
};

export async function watchResources({ resourceGraph, resources, onChange }: WatchResourcesOptions) {
	await onChange?.();

	const subscriptions: AsyncSubscription[] = [];
	for (const folder of resourceGraph.folders) {
		const subscription = await subscribe(folder, async (err, events) => {
			if (err) throw err;

			for (const event of events) {
				if (event.type === "create") resourceGraph.addFile(event.path, resources);
				if (event.type === "delete") resourceGraph.removeFile(event.path, resources);

				await onChange?.(event);
			}
		});

		subscriptions.push(subscription);
	}

	return async () => await Promise.all(subscriptions.map(async subscription => subscription.unsubscribe()));
}
