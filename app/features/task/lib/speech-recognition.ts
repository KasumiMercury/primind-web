type SpeechRecognitionConstructor = new () => SpeechRecognition;

export function isSpeechRecognitionSupported(): boolean {
	if (typeof window === "undefined") return false;
	return "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
}

export function getSpeechRecognition(): SpeechRecognitionConstructor | null {
	if (typeof window === "undefined") return null;

	if ("SpeechRecognition" in window && window.SpeechRecognition) {
		return window.SpeechRecognition;
	}

	if ("webkitSpeechRecognition" in window && window.webkitSpeechRecognition) {
		return window.webkitSpeechRecognition;
	}

	return null;
}

export function mapLocaleToSpeechLang(locale: string): string {
	if (locale.startsWith("ja")) return "ja-JP";
	if (locale.startsWith("en")) return "en-US";

	return "en-US";
}
