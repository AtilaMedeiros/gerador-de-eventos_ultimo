import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/contexts/AuthContext'
import { EventProvider } from '@/contexts/EventContext'
import { ModalityProvider } from '@/contexts/ModalityContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { CommunicationProvider } from '@/contexts/CommunicationContext'
import { ParticipantProvider } from '@/contexts/ParticipantContext'
import ProtectedRoute from '@/components/ProtectedRoute'

import Layout from './components/Layout'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import DashboardHome from './pages/dashboard/DashboardHome'
import EventsList from './pages/dashboard/basic-registration/EventsList'
import EventForm from './pages/dashboard/basic-registration/EventForm'
import ModalitiesList from './pages/dashboard/basic-registration/ModalitiesList'
import ModalityForm from './pages/dashboard/basic-registration/ModalityForm'
import VisualIdentityList from './pages/dashboard/basic-registration/VisualIdentityList'
import VisualIdentityForm from './pages/dashboard/basic-registration/VisualIdentityForm'
import UsersList from './pages/dashboard/basic-registration/UsersList'
import UserForm from './pages/dashboard/basic-registration/UserForm'
import AssociateModalities from './pages/dashboard/event-config/AssociateModalities'
import ApplyVisualIdentity from './pages/dashboard/event-config/ApplyVisualIdentity'
import Communication from './pages/dashboard/event-config/Communication'
import Reports from './pages/dashboard/Reports'
import Profile from './pages/dashboard/Profile'
import Settings from './pages/dashboard/Settings'
import EventPage from './pages/public/EventPage'
import EventCommunicationPage from './pages/public/EventCommunicationPage'
import AccessDenied from './pages/AccessDenied'

// Event Panel Pages
import EventPanelLayout from './components/EventPanelLayout'
import EventPanelDashboard from './pages/dashboard/event-panel/EventPanelDashboard'
import EventSchools from './pages/dashboard/event-panel/EventSchools'
import EventReports from './pages/dashboard/event-panel/EventReports'

// Participant Pages
import ParticipantLayout from './components/ParticipantLayout'
import ParticipantLogin from './pages/participant/ParticipantLogin'
import ParticipantRegister from './pages/participant/ParticipantRegister'
import ParticipantHome from './pages/participant/ParticipantHome'
import SchoolProfile from './pages/participant/SchoolProfile'
import AthletesList from './pages/participant/athletes/AthletesList'
import AthleteForm from './pages/participant/athletes/AthleteForm'
import AthleteInscription from './pages/participant/athletes/AthleteInscription'
import TechniciansList from './pages/participant/technicians/TechniciansList'
import TechnicianForm from './pages/participant/technicians/TechnicianForm'
import InscriptionForms from './pages/participant/InscriptionForms'
import PrintableInscriptionForm from './pages/participant/PrintableInscriptionForm'

const App = () => (
  <BrowserRouter
    future={{ v7_startTransition: false, v7_relativeSplatPath: false }}
  >
    <AuthProvider>
      <EventProvider>
        <ModalityProvider>
          <ThemeProvider>
            <CommunicationProvider>
              <ParticipantProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Login />} />
                    <Route path="/evento/:slug/:id" element={<EventPage />} />
                    <Route
                      path="/evento/:slug/:id/comunicacao"
                      element={<EventCommunicationPage />}
                    />

                    {/* Participant Public Routes */}
                    <Route
                      path="/area-do-participante/login"
                      element={<ParticipantLogin />}
                    />
                    <Route
                      path="/area-do-participante/cadastro"
                      element={<ParticipantRegister />}
                    />
                    <Route
                      path="/area-do-participante/imprimir/:eventId/:modalityId"
                      element={<PrintableInscriptionForm />}
                    />

                    {/* Participant Protected Routes */}
                    <Route
                      path="/area-do-participante"
                      element={
                        <ProtectedRoute>
                          <ParticipantLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={<Navigate to="inicio" replace />} />
                      <Route path="inicio" element={<ParticipantHome />} />
                      <Route path="escola" element={<SchoolProfile />} />
                      <Route path="atletas" element={<AthletesList />} />
                      <Route path="atletas/novo" element={<AthleteForm />} />
                      <Route path="atletas/:id" element={<AthleteForm />} />
                      <Route
                        path="atletas/:id/inscricao"
                        element={<AthleteInscription />}
                      />
                      <Route path="tecnicos" element={<TechniciansList />} />
                      <Route
                        path="tecnicos/novo"
                        element={<TechnicianForm />}
                      />
                      <Route path="tecnicos/:id" element={<TechnicianForm />} />
                      <Route path="fichas" element={<InscriptionForms />} />
                    </Route>

                    {/* Admin/Producer Protected Dashboard Routes */}
                    <Route
                      path="/area-do-produtor"
                      element={
                        <ProtectedRoute>
                          <Layout />
                        </ProtectedRoute>
                      }
                    >
                      <Route
                        index
                        element={
                          <Navigate to="/area-do-produtor/inicio" replace />
                        }
                      />
                      <Route path="inicio" element={<DashboardHome />} />

                      {/* Cadastro Básico */}
                      <Route path="cadastro-basico">
                        <Route path="evento" element={<EventsList />} />
                        <Route path="evento/novo" element={<EventForm />} />
                        <Route path="evento/:id" element={<EventForm />} />

                        <Route
                          path="modalidades"
                          element={<ModalitiesList />}
                        />
                        <Route
                          path="modalidades/:id"
                          element={<ModalityForm />}
                        />

                        <Route
                          path="identidade-visual"
                          element={<VisualIdentityList />}
                        />
                        <Route
                          path="identidade-visual/novo"
                          element={<VisualIdentityForm />}
                        />
                        <Route
                          path="identidade-visual/:id"
                          element={<VisualIdentityForm />}
                        />
                        <Route path="usuarios" element={<UsersList />} />
                        <Route path="usuarios/novo" element={<UserForm />} />
                        <Route path="usuarios/:id" element={<UserForm />} />
                      </Route>

                      {/* Configurar Evento (Global/Legacy) */}
                      <Route path="configurar-evento">
                        <Route
                          path="modalidades"
                          element={<AssociateModalities />}
                        />
                        <Route
                          path="identidade-visual"
                          element={<ApplyVisualIdentity />}
                        />
                        <Route path="comunicacao" element={<Communication />} />
                      </Route>

                      <Route path="relatorios" element={<Reports />} />
                      <Route path="perfil" element={<Profile />} />
                      <Route path="configuracoes" element={<Settings />} />
                    </Route>

                    {/* Event Specific Panel Layout */}
                    <Route
                      path="/area-do-produtor/evento/:eventId"
                      element={
                        <ProtectedRoute>
                          <EventPanelLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route
                        index
                        element={<Navigate to="dashboard" replace />}
                      />
                      <Route
                        path="dashboard"
                        element={<EventPanelDashboard />}
                      />
                      <Route path="relatorios" element={<EventReports />} />
                      <Route path="escolas" element={<EventSchools />} />
                      <Route
                        path="modalidades"
                        element={<AssociateModalities />}
                      />
                      <Route path="tema" element={<ApplyVisualIdentity />} />
                      <Route path="comunicacao" element={<Communication />} />
                    </Route>

                    <Route path="/acesso-negado" element={<AccessDenied />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </TooltipProvider>
              </ParticipantProvider>
            </CommunicationProvider>
          </ThemeProvider>
        </ModalityProvider>
      </EventProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
