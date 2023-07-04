


export default ([
  {
    title: 'Dashboard',
    to: { name: 'dashboard' },
    icon: { icon: 'tabler-layout-dashboard' },
    subject: 'Admin',
    action: 'read',
    hidden: true,
  },
  {
    title: 'Candidates',
    to: { name: 'candidates' },
    icon: { icon: 'tabler-users-group' },
    subject: 'Admin',
    action: 'read',
  },
  {
    title: 'Registration',
    to: { name: 'register' },
    icon: { icon: 'tabler-square-rounded-plus' },
    subject: 'Admin',
    action: 'read',
  },
  {
    title: 'Miscs',
    icon: { icon: 'tabler-tool' },
    children: [
      {
        title: 'Contests',
        to: { name: 'miscs-contests' },
        icon: { icon: 'tabler-barbell' },
        subject: 'Admin',
        action: 'read',
      },
      {
        title: 'Users',
        to: { name: 'miscs-users' },
        icon: { icon: 'tabler-users-group' },
        subject: 'Admin',
        action: 'read',
      },
      {
        title: 'Logs',
        to: { name: 'miscs-logs' },
        icon: { icon: 'tabler-info-square-rounded' },
        subject: 'Admin',
        action: 'read',
      },
    ],
  },
])

