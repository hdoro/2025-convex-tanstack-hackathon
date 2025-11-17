import { Slider } from '@/components/ui/slider'
import { useFieldContext } from '@/hooks/form-context'
import FieldLayout, { type FieldProps } from './field-layout'

export default function SliderField({
	min = 0,
	max = 100,
	step = 1,
	...props
}: FieldProps<
	Pick<React.ComponentProps<typeof Slider>, 'min' | 'max' | 'step'>
>) {
	const field = useFieldContext<number>()

	return (
		<FieldLayout {...props}>
			<Slider
				id={field.id}
				onBlur={field.handleBlur}
				min={min}
				max={max}
				step={step}
				value={field.store.state.value ? [field.store.state.value] : []}
				onValueChange={(value) => field.handleChange(value[0])}
			/>
		</FieldLayout>
	)
}
