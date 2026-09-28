import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { RegistryProvider } from './context/RegistryContext'
import { HomePage } from './pages/HomePage'
import { ReportPage } from './pages/ReportPage'
import { BrowsePage } from './pages/BrowsePage'
import { TreasuryPage } from './pages/TreasuryPage'
import { ClaimingPage } from './pages/ClaimingPage'
import { WorldPage } from './pages/WorldPage'
import { NewsPage } from './pages/NewsPage'
import { FaqPage } from './pages/FaqPage'
import { ContactPage } from './pages/ContactPage'
import { ArchivesPage } from './pages/ArchivesPage'

export default function App() {
  return (
    <AuthProvider>
      <RegistryProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/browse" element={<BrowsePage />} />
            <Route path="/treasury" element={<TreasuryPage />} />
            <Route path="/claiming" element={<ClaimingPage />} />
            <Route path="/world" element={<WorldPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/archives" element={<ArchivesPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </RegistryProvider>
    </AuthProvider>
  )
}
