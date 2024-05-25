import { detect } from "@diacritic/detector";
import { htmlLangAttributeDetector } from "@diacritic/detector/client";
import { DiacriticProvider, createDiacritic } from "@diacritic/react";
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import * as registry from "virtual:translations/registry";

import { Application } from "./application";

async function main() {
	const language = detect(registry, htmlLangAttributeDetector);
	const diacritic = await createDiacritic(registry, language, ["common"]);

	createRoot(document.getElementById("root")!).render(
		<DiacriticProvider diacritic={diacritic}>
			<StrictMode>
				<Suspense fallback="loading...">
					<Application />
				</Suspense>
			</StrictMode>
		</DiacriticProvider>,
	);
}

main();
