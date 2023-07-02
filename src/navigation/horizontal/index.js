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
    title: 'Miscs',
    icon: { icon: 'tabler-tool' },
    children: [
      {
        title: 'Contests',
        to: { name: 'miscs-contests' },
        icon: { icon: 'tabler-barbell' },
      },
      {
        title: 'Logs',
        to: { name: 'miscs-logs' },
        icon: { icon: 'tabler-info-square-rounded' },
      },
    ],
  },
]
