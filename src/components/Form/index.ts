/**
 * Form Components
 *
 * Standardized form components with consistent theming, variants, sizes, and states.
 * All components integrate with the theme system via useAppTheme() and support
 * accessibility features including ARIA attributes, keyboard navigation, and focus management.
 */

// Button
export { Button } from './Button/Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button/Button';

// Input
export { Input } from './Input/Input';
export type { InputProps, InputVariant, InputSize } from './Input/Input';

// DateInput
export { DateInput } from './DateInput/DateInput';
export type {
  DateInputProps,
  DateInputVariant,
  DateInputSize,
} from './DateInput/DateInput';

// Textarea
export { Textarea } from './Textarea/Textarea';
export type {
  TextareaProps,
  TextareaVariant,
  TextareaSize,
  TextareaResize,
} from './Textarea/Textarea';

// Select
export { Select } from './Select/Select';
export type {
  SelectProps,
  SelectVariant,
  SelectSize,
  SelectOption,
} from './Select/Select';

// Checkbox
export { Checkbox } from './Checkbox/Checkbox';
export type { CheckboxProps, CheckboxSize } from './Checkbox/Checkbox';

// Radio
export { Radio } from './Radio/Radio';
export type { RadioProps, RadioSize } from './Radio/Radio';

// Slider
export { Slider } from './Slider/Slider';
export type { SliderProps, SliderSize } from './Slider/Slider';

// Tabs
export { Tabs } from './Tabs/Tabs';
export type { TabsProps, TabsVariant, TabsSize, Tab } from './Tabs/Tabs';

// Legacy exports (deprecated - use new components above)
export { FormSelect } from './FormSelect';
export type { FormSelectProps, FormSelectOption } from './FormSelect';
export { FormButton } from './FormButton';
export type { FormButtonProps } from './FormButton';
