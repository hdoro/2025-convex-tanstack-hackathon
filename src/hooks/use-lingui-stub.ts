/**
 * I couldn't get Lingui to work with Tanstack Start before the end of the hackathon.
 * This is a stub to incentivize me to include translated strings everywhere in the app,
 * so that later translation becomes easy.
 */
export function useLingui() {
	return {
		t: plainString,
	}
}

export type MacroMessageDescriptor = string & {
	_brand: 'MacroMessageDescriptor'
}

export function msg(strings: TemplateStringsArray, ...values: unknown[]) {
	return plainString(strings, ...values) as MacroMessageDescriptor
}

function plainString(
	strings: TemplateStringsArray,
	...values: unknown[]
): string {
	return strings.reduce((result, str, i) => {
		return result + str + (values[i] ?? '')
	}, '')
}
