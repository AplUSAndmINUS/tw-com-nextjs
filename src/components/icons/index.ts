/**
 * Local SVG icon set.
 *
 * This set replaced `@fluentui/react-icons` throughout the app. The old
 * `src/utils/iconResolver.ts` did `import * as FluentIcons from
 * '@fluentui/react-icons'`, and a namespace import defeats tree shaking: the
 * bundler has to keep the entire package (thousands of glyph modules) because
 * any key could be read off the namespace object at runtime. We were paying for
 * all of it to service roughly fifteen string lookups plus a couple of dozen
 * named imports.
 *
 * These are hand-authored equivalents on a shared 24x24 grid: one component per
 * glyph, size driven by the `size` prop rather than baked into the name, and
 * colour inherited from the CSS `color` property via `currentColor`. Nothing
 * here imports from node_modules, so only the icons you reference ship.
 *
 * Glyphs that Fluent rendered "Filled" (Code, DesignIdeas, Heart, Play) expose
 * a `filled` prop instead of a separate component; `ICON_MAP` binds it for the
 * legacy string names via the wrappers in `./filledVariants`.
 */

export type { IconProps } from './types';

export { AccessibilityIcon } from './AccessibilityIcon';
export { AddIcon } from './AddIcon';
export { ArrowExpandIcon } from './ArrowExpandIcon';
export { ArrowLeftIcon } from './ArrowLeftIcon';
export { ArrowRightIcon } from './ArrowRightIcon';
export { BookIcon } from './BookIcon';
export { BriefcaseMedicalIcon } from './BriefcaseMedicalIcon';
export { CalendarIcon } from './CalendarIcon';
export { CheckmarkIcon } from './CheckmarkIcon';
export { ChevronDownIcon } from './ChevronDownIcon';
export { ChevronLeftIcon } from './ChevronLeftIcon';
export { ChevronRightIcon } from './ChevronRightIcon';
export { ChevronUpIcon } from './ChevronUpIcon';
export { CodeIcon } from './CodeIcon';
export { ContactCardIcon } from './ContactCardIcon';
export { DeleteIcon } from './DeleteIcon';
export { DesignIdeasIcon } from './DesignIdeasIcon';
export { DismissIcon } from './DismissIcon';
export { DismissSquareIcon } from './DismissSquareIcon';
export { DocumentTextIcon } from './DocumentTextIcon';
export { EditIcon } from './EditIcon';
export { ErrorCircleIcon } from './ErrorCircleIcon';
export { HeartIcon } from './HeartIcon';
export { HomeIcon } from './HomeIcon';
export { ListIcon } from './ListIcon';
export { LiveOffIcon } from './LiveOffIcon';
export { LocationNotFoundIcon } from './LocationNotFoundIcon';
export { MicIcon } from './MicIcon';
export { NavigationIcon } from './NavigationIcon';
export { PenIcon } from './PenIcon';
export { PeopleCommunityIcon } from './PeopleCommunityIcon';
export { PeopleIcon } from './PeopleIcon';
export { PersonIcon } from './PersonIcon';
export { PlayIcon } from './PlayIcon';
export { QuestionCircleIcon } from './QuestionCircleIcon';
export { SearchIcon } from './SearchIcon';
export { SettingsIcon } from './SettingsIcon';
export { SubtractIcon } from './SubtractIcon';
export { VideoClipIcon } from './VideoClipIcon';
export { VideoIcon } from './VideoIcon';
export { WeatherMoonIcon } from './WeatherMoonIcon';
export { WeatherSunnyIcon } from './WeatherSunnyIcon';
export { WindowNewIcon } from './WindowNewIcon';
export {
  CodeFilledIcon,
  DesignIdeasFilledIcon,
  HeartFilledIcon,
  PlayFilledIcon,
} from './filledVariants';

import type { IconProps } from './types';
import { AccessibilityIcon } from './AccessibilityIcon';
import { AddIcon } from './AddIcon';
import { ArrowExpandIcon } from './ArrowExpandIcon';
import { ArrowLeftIcon } from './ArrowLeftIcon';
import { ArrowRightIcon } from './ArrowRightIcon';
import { BookIcon } from './BookIcon';
import { BriefcaseMedicalIcon } from './BriefcaseMedicalIcon';
import { CalendarIcon } from './CalendarIcon';
import { CheckmarkIcon } from './CheckmarkIcon';
import { ChevronDownIcon } from './ChevronDownIcon';
import { ChevronLeftIcon } from './ChevronLeftIcon';
import { ChevronRightIcon } from './ChevronRightIcon';
import { ChevronUpIcon } from './ChevronUpIcon';
import { CodeIcon } from './CodeIcon';
import { ContactCardIcon } from './ContactCardIcon';
import { DeleteIcon } from './DeleteIcon';
import { DesignIdeasIcon } from './DesignIdeasIcon';
import { DismissIcon } from './DismissIcon';
import { DismissSquareIcon } from './DismissSquareIcon';
import { DocumentTextIcon } from './DocumentTextIcon';
import { EditIcon } from './EditIcon';
import { ErrorCircleIcon } from './ErrorCircleIcon';
import { HeartIcon } from './HeartIcon';
import { HomeIcon } from './HomeIcon';
import { ListIcon } from './ListIcon';
import { LiveOffIcon } from './LiveOffIcon';
import { LocationNotFoundIcon } from './LocationNotFoundIcon';
import { MicIcon } from './MicIcon';
import { NavigationIcon } from './NavigationIcon';
import { PenIcon } from './PenIcon';
import { PeopleCommunityIcon } from './PeopleCommunityIcon';
import { PeopleIcon } from './PeopleIcon';
import { PersonIcon } from './PersonIcon';
import { PlayIcon } from './PlayIcon';
import { QuestionCircleIcon } from './QuestionCircleIcon';
import { SearchIcon } from './SearchIcon';
import { SettingsIcon } from './SettingsIcon';
import { SubtractIcon } from './SubtractIcon';
import { VideoClipIcon } from './VideoClipIcon';
import { VideoIcon } from './VideoIcon';
import { WeatherMoonIcon } from './WeatherMoonIcon';
import { WeatherSunnyIcon } from './WeatherSunnyIcon';
import { WindowNewIcon } from './WindowNewIcon';
import {
  CodeFilledIcon,
  DesignIdeasFilledIcon,
  HeartFilledIcon,
  PlayFilledIcon,
} from './filledVariants';

/**
 * Legacy `@fluentui/react-icons` export names mapped onto their replacement.
 *
 * Keeps the string-based call sites (content config, CMS data, `resolveIconName`)
 * working unchanged. Size suffixes in the keys are historical only — the
 * component sizes itself from the `size` prop.
 */
export const ICON_MAP = {
  Accessibility28Regular: AccessibilityIcon,
  AccessibilityRegular: AccessibilityIcon,
  Add24Regular: AddIcon,
  Add32Regular: AddIcon,
  ArrowExpand28Regular: ArrowExpandIcon,
  ArrowLeft20Regular: ArrowLeftIcon,
  ArrowLeft24Regular: ArrowLeftIcon,
  ArrowLeft32Regular: ArrowLeftIcon,
  ArrowRight20Regular: ArrowRightIcon,
  ArrowRight24Regular: ArrowRightIcon,
  ArrowRight32Regular: ArrowRightIcon,
  BookRegular: BookIcon,
  BriefcaseMedical32Regular: BriefcaseMedicalIcon,
  Calendar24Regular: CalendarIcon,
  CalendarLtr20Regular: CalendarIcon,
  CalendarLtr24Regular: CalendarIcon,
  Checkmark24Regular: CheckmarkIcon,
  Checkmark28Regular: CheckmarkIcon,
  ChevronDown20Regular: ChevronDownIcon,
  ChevronDown24Regular: ChevronDownIcon,
  ChevronLeft20Regular: ChevronLeftIcon,
  ChevronLeft24Regular: ChevronLeftIcon,
  ChevronRight20Regular: ChevronRightIcon,
  ChevronRight24Regular: ChevronRightIcon,
  ChevronUp20Regular: ChevronUpIcon,
  ChevronUp24Regular: ChevronUpIcon,
  Code24Filled: CodeFilledIcon,
  Code24Regular: CodeIcon,
  CodeFilled: CodeFilledIcon,
  ContactCard24Regular: ContactCardIcon,
  Delete32Regular: DeleteIcon,
  DesignIdeas28Filled: DesignIdeasFilledIcon,
  DesignIdeasFilled: DesignIdeasFilledIcon,
  Dismiss24Regular: DismissIcon,
  Dismiss32Regular: DismissIcon,
  DismissSquare32Regular: DismissSquareIcon,
  DocumentText24Regular: DocumentTextIcon,
  DocumentText32Regular: DocumentTextIcon,
  Edit32Regular: EditIcon,
  ErrorCircle24Regular: ErrorCircleIcon,
  Heart24Regular: HeartIcon,
  Heart28Filled: HeartFilledIcon,
  HeartFilled: HeartFilledIcon,
  Home16Regular: HomeIcon,
  Home24Regular: HomeIcon,
  Home32Regular: HomeIcon,
  Home48Regular: HomeIcon,
  HomeRegular: HomeIcon,
  List24Regular: ListIcon,
  LiveOff24Regular: LiveOffIcon,
  LocationNotFound24Regular: LocationNotFoundIcon,
  Mic32Regular: MicIcon,
  MicRegular: MicIcon,
  Navigation32Regular: NavigationIcon,
  PenRegular: PenIcon,
  People24Regular: PeopleIcon,
  PeopleCommunity28Regular: PeopleCommunityIcon,
  PeopleCommunityRegular: PeopleCommunityIcon,
  Person24Regular: PersonIcon,
  Person32Regular: PersonIcon,
  Play24Filled: PlayFilledIcon,
  QuestionCircle28Regular: QuestionCircleIcon,
  Search20Regular: SearchIcon,
  Search24Regular: SearchIcon,
  Search32Regular: SearchIcon,
  Settings24Regular: SettingsIcon,
  Settings32Regular: SettingsIcon,
  Subtract24Regular: SubtractIcon,
  Video24Regular: VideoIcon,
  Video32Regular: VideoIcon,
  VideoClipRegular: VideoClipIcon,
  WeatherMoon32Regular: WeatherMoonIcon,
  WeatherSunny32Regular: WeatherSunnyIcon,
  WindowNew20Regular: WindowNewIcon,
  WindowNew24Regular: WindowNewIcon,
} as const satisfies Record<string, React.ComponentType<IconProps>>;

export type LegacyIconName = keyof typeof ICON_MAP;
