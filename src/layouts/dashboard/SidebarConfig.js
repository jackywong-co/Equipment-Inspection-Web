import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import clipboardFill from '@iconify/icons-eva/clipboard-fill';
import speakerFill from '@iconify/icons-eva/speaker-fill';
import compassFill from '@iconify/icons-eva/compass-fill';
import questionMarkCicleFill from '@iconify/icons-eva/question-mark-circle-fill';
import checkmarkSquare2Fill from '@iconify/icons-eva/checkmark-square-2-fill';
// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon(pieChart2Fill)
  },
  {
    title: 'record',
    path: '/dashboard/record',
    icon: getIcon(checkmarkSquare2Fill)
  },
  {
    title: 'user',
    path: '/dashboard/user',
    icon: getIcon(peopleFill)
  },
  {
    title: 'form',
    path: '/dashboard/form',
    icon: getIcon(clipboardFill)
  },
  {
    title: 'room',
    path: '/dashboard/room',
    icon: getIcon(compassFill)
  },
  {
    title: 'equipment',
    path: '/dashboard/equipment',
    icon: getIcon(speakerFill)
  },
  {
    title: 'question',
    path: '/dashboard/question',
    icon: getIcon(questionMarkCicleFill)
  },

];

export default sidebarConfig;
