import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import {
  NotFound,
  Login,
  Register,
  CourseList,
  CourseDetail
} from './pages'
import RootLayout from './layout/RootLayout.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error.response?.status === 404) {
          return false; // Don't retry on 404 errors
        }
        return failureCount < 2;
      },
      staleTime: 1000 * 60, // 60 seconds
      gcTime: 1000 * 60 * 5, // 5 minute
    }
  }
})

const router = createBrowserRouter([
    {
      index: true,
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      element: <ProtectedRoute />,
      children: [
        {
          element: <RootLayout />,
          children: [
            {
              path: "/courses",
              element: <CourseList />,
            },
            {
              path: "/courses/:course_id",
              element: <CourseDetail />,
            },
          ],
        }
      ]
    },
    {
      path: "*",
      element: <NotFound />,
    }
]);

function App() {

  return (
    <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
    </QueryClientProvider>

  )
}

export default App

