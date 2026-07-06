import { BrowserRouter, Route, Routes } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import HomeLayout from "./Layout/HomeLayout"
import MovieListPage from "./pages/MovieListPage"
import MovieDetailPage from "./pages/MovieDetailPage"
import NotFoundPage from "./pages/NotFoundPage"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Provider } from "react-redux"
import { store } from "./store/store"
import AdminLayout from "./Layout/AdminLayout"
import UserPage from "./pages/admin/UserPage"
import CinemaPage from "./pages/CinemaPage"
import ProfilePage from "./pages/ProfilePage"
import ProtectedRoute from "./components/ProtectedRoute"
import ProtectedAdminRoute from "./components/ProtectedAdminRoute"
import FilmPage from "./pages/admin/FilmPage"
import FilmEditPage from "./pages/admin/FilmEditPage"
import FilmShowtimePage from "./pages/admin/FilmShowtimePage"
import ShowtimeManagementPage from "./pages/admin/ShowtimeManagementPage"
import RegisterPage from "./pages/RegisterPage"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 3,
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="/" element={<HomeLayout />}>
              <Route index element={<MovieListPage />} />
              <Route path="movie" element={<MovieListPage />} />
              <Route path="movie/:maPhim" element={<MovieDetailPage />} />
              <Route path="cinema" element={<CinemaPage />} />
              <Route path="profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="thongtincanhan" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
            </Route>

            {/* admin routes */}
            <Route path="/admin" element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }>
              <Route index element={<FilmPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="users" element={<UserPage />} />
              <Route path="films" element={<FilmPage />} />
              <Route path="films/edit/:idFilm" element={<FilmEditPage />} />
              <Route path="films/showtime/:idFilm" element={<FilmShowtimePage />} />
              <Route path="showtimes" element={<ShowtimeManagementPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
