import { Navigate, createBrowserRouter } from 'react-router-dom'

import { RequireAuth } from '@/app/router/require-auth'
import { AuthPage } from '@/pages/auth/auth-page'
import { DashboardPage } from '@/pages/dashboard/dashboard-page'
import { ProductDetailsPage } from '@/pages/product-details/product-details-page'
import { ProductsIndexPage } from '@/pages/products/products-index-page'
import { ProductsLayoutPage } from '@/pages/products/products-layout-page'
import { SalesPage } from '@/pages/sales/sales-page'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthPage />,
  },
  {
    path: '/auth',
    element: <AuthPage />,
  },
  {
    element: <RequireAuth />,
    children: [
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'products',
        element: <ProductsLayoutPage />,
        children: [
          {
            index: true,
            element: <ProductsIndexPage />,
          },
          {
            path: ':productId',
            element: <ProductDetailsPage />,
          },
        ],
      },
      {
        path: 'sales',
        element: <SalesPage />,
      },
      {
        path: '*',
        element: <Navigate to="/auth" replace />,
      },
    ],
  },
])

