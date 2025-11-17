import { createFormHook } from '@tanstack/react-form'
import SliderField from '@/components/forms/slider-field'
import SubmitButton from '@/components/forms/submit-button'
import TextField from '@/components/forms/text-field'
import TextareaField from '@/components/forms/textarea-field'
import { fieldContext, formContext } from './form-context'

export const { useAppForm } = createFormHook({
	fieldComponents: {
		TextField,
		TextareaField,
		SliderField,
	},
	formComponents: {
		SubmitButton,
	},
	fieldContext,
	formContext,
})
