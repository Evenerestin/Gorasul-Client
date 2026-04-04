import { BrowserRouter, Route, Routes } from 'react-router';
import AdminRoute from './guards/AdminRoute';
import ProtectedRoute from './components/ProtectedRoute';
import { extraRoutes, navSections, seasonalConfig } from './config/routes';
import { AuthProvider } from './contexts/AuthProvider';
import AppLayout from './layout/AppLayout';
import AuthCallback from './pages/AuthCallback';
import NotFound from './pages/NotFound';

function App() {
  const activeSections = navSections.filter((s) => !s.seasonal || seasonalConfig[s.seasonal]);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<AppLayout />}>
            {activeSections.flatMap((section) =>
              section.items.flatMap((item) => {
                const wrap = (el: React.ReactNode) => {
                  if (item.adminOnly) return <AdminRoute>{el}</AdminRoute>;
                  if (section.protected) return <ProtectedRoute>{el}</ProtectedRoute>;
                  return el;
                };
                const routes = [
                  <Route
                    key={item.path}
                    path={item.path === '/' ? undefined : item.path}
                    index={item.path === '/'}
                    element={wrap(<item.element />)}
                  />
                ];
                if (item.submenu) {
                  for (const sub of item.submenu) {
                    routes.push(
                      <Route key={sub.path} path={sub.path} element={wrap(<sub.element />)} />
                    );
                  }
                }
                return routes;
              })
            )}
            {extraRoutes.map((route) => {
              const element = route.protected ? (
                <ProtectedRoute>
                  <route.element />
                </ProtectedRoute>
              ) : (
                <route.element />
              );
              return <Route key={route.path} path={route.path} element={element} />;
            })}
            <Route path="/*" element={<NotFound />} />
          </Route>
          <Route path="/auth/callback" element={<AuthCallback />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
