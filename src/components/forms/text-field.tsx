import { Input } from '@/components/ui/input'
import { useFieldContext } from '@/hooks/form-context'
import { type MacroMessageDescriptor, useLingui } from '@/hooks/use-lingui-stub'
import FieldLayout, { type FieldProps } from './field-layout'

export default function TextField({
	placeholder,
	...props
}: FieldProps<{
	placeholder?: MacroMessageDescriptor
}>) {
	const field = useFieldContext<string>()
	const { t } = useLingui()

	return (
		<FieldLayout {...props}>
			<Input
				id={field.id}
				value={field.store.state.value}
				placeholder={placeholder ? t(placeholder) : undefined}
				onBlur={field.handleBlur}
				onChange={(e) => field.handleChange(e.target.value)}
			/>
		</FieldLayout>
	)
}
