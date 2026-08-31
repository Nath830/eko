import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { EventComposerDialog } from './components/calendar/EventComposerDialog'
import { Toaster } from './components/ui/Toaster'
import { CalendarScreen } from './screens/CalendarScreen'
import { ContactDetailScreen } from './screens/ContactDetailScreen'
import { ContactsScreen } from './screens/ContactsScreen'
import { HomeScreen } from './screens/HomeScreen'
import { InboxScreen } from './screens/InboxScreen'
import { NotesScreen } from './screens/NotesScreen'
import { PriorityScreen } from './screens/PriorityScreen'
import { SettingsScreen } from './screens/SettingsScreen'
import { EkoProvider } from './store/EkoStore'
import { ChatProvider } from './store/ChatContext'
import { EventComposerProvider } from './store/EventComposerContext'
import { ToastProvider } from './store/ToastContext'

/* Les espaces d'Eko.

   👉 POUR AJOUTER UN ÉCRAN : une entrée dans src/config/navigation.tsx
      et une ligne <Route> ci-dessous.

   L'adresse utilise un « # » : c'est ce qui permet la publication sur
   GitHub Pages et, plus tard, l'installation en PWA. */
export default function App() {
  return (
    <ToastProvider>
      <EkoProvider>
        <EventComposerProvider>
        <ChatProvider>
        <HashRouter>
          <Routes>
            {/* La page d'accueil a sa propre mise en page */}
            <Route path="/" element={<HomeScreen />} />

            <Route element={<AppShell />}>
              <Route path="reception" element={<InboxScreen />} />
              <Route path="reception/:conversationId" element={<InboxScreen />} />
              <Route path="priorites" element={<PriorityScreen />} />
              <Route path="calendrier" element={<CalendarScreen />} />
              <Route path="contacts" element={<ContactsScreen />} />
              <Route path="contacts/:contactId" element={<ContactDetailScreen />} />
              <Route path="notes" element={<NotesScreen />} />
              <Route path="reglages" element={<SettingsScreen />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <Toaster />
          <EventComposerDialog />
        </HashRouter>
        </ChatProvider>
        </EventComposerProvider>
      </EkoProvider>
    </ToastProvider>
  )
}
