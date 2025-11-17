import { Input } from '@/components/ui/input'
import { useFieldContext } from '@/hooks/form-context'
import { type MacroMessageDescriptor, useLingui } from '@/hooks/use-lingui-stub'
import { Textarea } from '../ui/textarea'
import FieldLayout, { type FieldProps } from './field-layout'

export default function TextareaField({
	placeholder,
	rows = 2,
	...props
}: FieldProps<{
	placeholder?: MacroMessageDescriptor
	rows?: number
}>) {
	const field = useFieldContext<string>()
	const { t } = useLingui()

	return (
		<FieldLayout {...props}>
			<Input
				value={field.store.state.value}
				placeholder={placeholder ? t(placeholder) : undefined}
				onBlur={field.handleBlur}
				onChange={(e) => field.handleChange(e.target.value)}
			/>
			<Textarea
				id={field.id}
				value={field.store.state.value}
				onBlur={field.handleBlur}
				rows={rows}
				onChange={(e) => field.handleChange(e.target.value)}
				placeholder={placeholder ? t(placeholder) : undefined}
			/>
		</FieldLayout>
	)
}
