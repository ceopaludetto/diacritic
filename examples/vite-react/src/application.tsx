import { useTranslation } from "@diacritic/react";

export function Application() {
	const { t, language, setLanguage } = useTranslation(["common", "withHyphen"]);

	return (
		<div>
			<h1>{t.common.hello()}</h1>
			<p>{t.withHyphen.someKey()}</p>
			<p>{t.common.interpolation(10)}</p>
			<p>{t.common.arr().join(" ")}</p>
			<button onClick={() => setLanguage(language === "en" ? "pt" : "en")}>
				{t.common.actions.switch()}
			</button>
		</div>
	);
}
