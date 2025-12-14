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

import ProducerLayout from './components/ProducerLayout'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import DashboardHome from './pages/producer/DashboardHome'
import EventsList from './pages/producer/basic-registration/EventsList'
import EventForm from './pages/producer/basic-registration/EventForm'
import EventWizard from './pages/producer/basic-registration/EventWizard'
import ModalitiesList from './pages/producer/basic-registration/ModalitiesList'
import ModalityForm from './pages/producer/basic-registration/ModalityForm'

import VisualIdentityForm from './pages/producer/basic-registration/VisualIdentityForm'
import UsersList from './pages/producer/basic-registration/UsersList'
import UserForm from './pages/producer/basic-registration/UserForm'
import SchoolsList from './pages/producer/basic-registration/SchoolsList'
import SchoolForm from './pages/producer/basic-registration/SchoolForm'
import SchoolTechnicians from './pages/producer/basic-registration/SchoolTechnicians'
import LinkSchoolEvents from './pages/producer/basic-registration/LinkSchoolEvents'
import AdminAthletesList from './pages/producer/basic-registration/AthletesList'
import AdminAthleteForm from './pages/producer/basic-registration/AthleteForm'
import AthleteModalities from './pages/producer/basic-registration/AthleteModalities'
import AssociateModalities from './pages/producer/event-config/AssociateModalities'
import ApplyVisualIdentity from './pages/producer/event-config/ApplyVisualIdentity'
import Communication from './pages/producer/event-config/Communication'
import EventCommunication from './pages/producer/event-config/EventCommunication'
import EventProducers from './pages/producer/event-config/EventProducers'
import Reports from './pages/producer/Reports'
import Profile from './pages/producer/Profile'
import Settings from './pages/producer/Settings'
import EventPage from './pages/public/EventPage'
import EventCommunicationPage from './pages/public/EventCommunicationPage'
import EventRegulationsPage from '@/pages/public/EventRegulationsPage'
import AccessDenied from './pages/AccessDenied'

// Event Panel Pages

import EventPanelDashboard from './pages/producer/event-panel/EventPanelDashboard'





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
import TechnicianInscription from './pages/participant/technicians/TechnicianInscription'
import InscriptionForms from './pages/participant/InscriptionForms'
import PrintableInscriptionForm from './pages/participant/PrintableInscriptionForm'

import { CreatedByBadge } from '@/components/CreatedByBadge'

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
                  <CreatedByBadge />
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Login />} />
                    <Route path="/evento/:slug/:id" element={<EventPage />} />
                    <Route
                      path="/evento/:slug/:id/comunicacao"
                      element={<EventCommunicationPage />}
                    />
                    <Route
                      path="/evento/:slug/:id/regulamentos"
                      element={<EventRegulationsPage />}
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
                      <Route
                        path="tecnicos/:id/inscricao"
                        element={<TechnicianInscription />}
                      />
                      <Route path="fichas" element={<InscriptionForms />} />
                    </Route>

                    {/* Admin/Producer Protected Dashboard Routes */}
                    <Route
                      path="/area-do-produtor"
                      element={
                        <ProtectedRoute>
                          <ProducerLayout />
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
                      {/* Escolas */}
                      <Route path="escolas" element={<SchoolsList />} />
                      <Route path="escolas/novo" element={<SchoolForm />} />
                      <Route path="escolas/:id" element={<SchoolForm />} />
                      <Route path="escolas/:id/participante" element={<SchoolTechnicians />} />
                      <Route path="escolas/:id/vincular-eventos" element={<LinkSchoolEvents />} />

                      {/* Atletas */}
                      <Route path="atletas" element={<AdminAthletesList />} />
                      <Route path="atletas/novo" element={<AdminAthleteForm />} />
                      <Route path="atletas/:id" element={<AdminAthleteForm />} />
                      <Route path="atletas/:id/modalidades" element={<AthleteModalities />} />

                      <Route path="evento" element={<EventsList />} />
                      <Route path="evento/novo" element={<EventWizard />} />
                      <Route path="evento/:id/produtor" element={<EventProducers />} />
                      <Route path="evento/:id/comunicacao" element={<EventCommunication />} />
                      <Route path="evento/:id" element={<EventForm />} />

                      <Route
                        path="identidade-visual"
                        element={<ApplyVisualIdentity />}
                      />
                      <Route
                        path="identidade-visual/novo"
                        element={<VisualIdentityForm />}
                      />
                      <Route
                        path="modalidades"
                        element={<ModalitiesList />}
                      />
                      <Route
                        path="modalidades/:id"
                        element={<ModalityForm />}
                      />
                      <Route path="usuarios" element={<UsersList />} />
                      <Route path="usuarios/novo" element={<UserForm />} />
                      <Route path="usuarios/:id" element={<UserForm />} />
                      <Route path="publicacoes" element={<Communication />} />

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
                          <ProducerLayout />
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
