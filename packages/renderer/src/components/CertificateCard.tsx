import { useTranslation } from 'react-i18next'

import { useCertificateCard } from '@renderer/components/CertificateCard.hooks'
import CertificateCardContent from '@renderer/components/CertificateCard.Content'

const CertificateCard = () => {
  const { t } = useTranslation()
  const {
    certificate,
    summary,
    verifyModalOpen,
    password,
    verifying,
    handleUpload,
    handleVerify,
    handleClear,
    openVerifyModal,
    closeVerifyModal,
    setPassword
  } = useCertificateCard()

  return (
    <CertificateCardContent
      t={t}
      certificate={certificate}
      summary={summary}
      verifyModalOpen={verifyModalOpen}
      password={password}
      verifying={verifying}
      handleUpload={handleUpload}
      handleVerify={handleVerify}
      handleClear={handleClear}
      openVerifyModal={openVerifyModal}
      closeVerifyModal={closeVerifyModal}
      setPassword={setPassword}
    />
  )
}

export default CertificateCard
