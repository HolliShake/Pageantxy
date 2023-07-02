export default [
  {
    title: 'Dashboard',
    to: { name: 'dashboard' },
    icon: { icon: 'tabler-layout-dashboard' },
  },
  {
    title: 'Candidates',
    to: { name: 'candidates' },
    icon: { icon: 'tabler-users-group' },
  },
  {
    title: 'Registration',
    to: { name: 'register' },
    icon: { icon: 'tabler-square-rounded-plus' },
  },
  {
    title: 'Miscs',
    icon: { icon: 'tabler-tool' },
    children: [
      {
        title: 'Contests',
        to: { name: 'miscs-contests' },
        icon: { icon: 'tabler-barbell' },
      },
      {
        title: 'Users',
        to: { name: 'miscs-users' },
        icon: { icon: 'tabler-users-group' },
      },
      {
        title: 'Logs',
        to: { name: 'miscs-logs' },
        icon: { icon: 'tabler-info-square-rounded' },
      },
    ],
  },
]
