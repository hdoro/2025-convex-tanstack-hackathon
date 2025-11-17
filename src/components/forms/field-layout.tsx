import type { FileSearchIcon } from '@phosphor-icons/react'
import type { PropsWithChildren } from 'react'
import { Label } from '@/components/ui/label'
import { useFieldContext } from '@/hooks/form-context'
import { type MacroMessageDescriptor, useLingui } from '@/hooks/use-lingui-stub'
import FieldErrorMessages from './field-error-messages'

export type FieldProps<CustomProps = {}> = CustomProps & {
	label: MacroMessageDescriptor
	required?: boolean
	icon?: typeof FileSearchIcon
}

export default function FieldLayout(props: PropsWithChildren<FieldProps>) {
	const { t } = useLingui()
	const { errors, errorDisplay, labelId, id } = useFieldContext()

	const Icon = props.icon
	return (
		<div className="flex flex-col gap-3">
			<div className="gap-3 md:flex-row md:items-center">
				<div className="flex-1 flex-row items-center gap-2">
					{Icon && <Icon className="size-6 text-accent-foreground" />}
					<Label htmlFor={id} id={labelId}>
						{t(props.label)}
					</Label>
				</div>
				{errorDisplay === 'label' && <FieldErrorMessages errors={errors} />}
			</div>

			{props.children}

			{errorDisplay === 'bottom' && <FieldErrorMessages errors={errors} />}
		</div>
	)
}
