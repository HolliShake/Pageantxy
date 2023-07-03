


export default Object.freeze([
  {
    title: 'Dashboard',
    to: { name: 'dashboard' },
    icon: { icon: 'tabler-layout-dashboard' },
    subject: 'all',
    action: 'manage',
  },
  {
    title: 'Candidates',
    to: { name: 'candidates' },
    icon: { icon: 'tabler-users-group' },
    subject: 'all',
    action: 'manage',
  },
  {
    title: 'Registration',
    to: { name: 'register' },
    icon: { icon: 'tabler-square-rounded-plus' },
    subject: 'all',
    action: 'manage',
  },
  {
    title: 'Miscs',
    icon: { icon: 'tabler-tool' },
    children: [
      {
        title: 'Contests',
        to: { name: 'miscs-contests' },
        icon: { icon: 'tabler-barbell' },
        subject: 'all',
        action: 'manage',
      },
      {
        title: 'Users',
        to: { name: 'miscs-users' },
        icon: { icon: 'tabler-users-group' },
        subject: 'all',
        action: 'manage',
      },
      {
        title: 'Logs',
        to: { name: 'miscs-logs' },
        icon: { icon: 'tabler-info-square-rounded' },
        subject: 'all',
        action: 'manage',
      },
    ],
  },
])

