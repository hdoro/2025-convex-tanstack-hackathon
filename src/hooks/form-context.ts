import { createFormHookContexts, useStore } from '@tanstack/react-form'

const {
	fieldContext,
	useFieldContext: useFieldContextRaw,
	formContext,
	useFormContext,
} = createFormHookContexts()

export type ErrorDisplay = 'none' | 'label' | 'bottom'

export type FieldAttributes = {
	id: string
	labelId: string
	name: string
	errors: any[]
	errorDisplay: ErrorDisplay
	invalid: boolean
	editable: boolean
}

function useFieldContext<TData>() {
	const field = useFieldContextRaw<TData | undefined>()

	const errorState = useStore(field.store, (state) => {
		const errors = state.meta.errors
		let errorDisplay: ErrorDisplay = 'bottom'

		if (!state.meta.isTouched || errors.length === 0) errorDisplay = 'none'
		if (errors.length === 1) errorDisplay = 'label'

		return {
			errors,
			errorDisplay,
			invalid: errorDisplay !== 'none',
		}
	})
	const id = `${field.form.formId}--${field.name}`
	const editable = useStore(field.form.store, (state) => !state.isSubmitting)

	const attributes: FieldAttributes = {
		...errorState,
		editable,
		id: id,
		labelId: `${id}--label`,
		name: field.name,
	}

	return {
		...field,
		...attributes,
	}
}

export { fieldContext, useFieldContext, formContext, useFormContext }
