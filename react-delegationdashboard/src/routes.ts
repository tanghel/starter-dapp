import React from 'react';
import MultisigDetailsPage from './pages/MultisigDetails/MultisigDetailsPage';
import Home from './pages/Home';
import withPageTitle from './components/PageTitle';
import Owner from 'pages/MultisigList/MultisigListPage';

interface RouteType {
  path: string;
  page: string;
  title: string;
  component: any;
}

const routes: RouteType[] = [
  {
    path: '/',
    page: 'home',
    title: '',
    component: Home,
  },
  {
    path: '/dashboard/:multisigAddressParam',
    page: 'dashboard',
    title: 'Dashboard',
    component: MultisigDetailsPage,
  },
  {
    path: '/owner',
    page: 'owner',
    title: 'Owner',
    component: Owner,
  },
];

const wrappedRoutes = () => {
  return routes.map(route => {
    const title = route.title ? `${route.title} • Multisig Manager` : 'Multisig Manager';
    return {
      path: route.path,
      page: route.page,
      component: (withPageTitle(title, route.component) as any) as React.ComponentClass<{}, any>,
    };
  });
};

export default wrappedRoutes();
