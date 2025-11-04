import { useProfilationPage } from '@renderer/pages/Profilation/useProfilationPage'
import ProfilationPageContent from '@renderer/pages/Profilation/ProfilationPage.Content'

const ProfilationPage = () => {
  useProfilationPage()

  return <ProfilationPageContent />
}

export default ProfilationPage
