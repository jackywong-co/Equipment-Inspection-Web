import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import clipboardFill from '@iconify/icons-eva/clipboard-fill';
import speakerFill from '@iconify/icons-eva/speaker-fill';
import compassFill from '@iconify/icons-eva/compass-fill';

// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon(pieChart2Fill)
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
  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: getIcon(lockFill)
  // },
  // {
  //   title: 'register',
  //   path: '/register',
  //   icon: getIcon(personAddFill)
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: getIcon(alertTriangleFill)
  // }
];

export default sidebarConfig;
