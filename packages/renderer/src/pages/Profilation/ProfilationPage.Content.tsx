import { Button, Col, Modal, Row, Space, Tabs, Grid, theme } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { InboxOutlined } from '@ant-design/icons'
import { useSearchParams } from 'react-router-dom'

import CertificateCard from '@renderer/components/CertificateCard'
import DemoUploadCard from '@renderer/components/DemoUploadCard'
import QuestionnaireStepper from '@renderer/components/QuestionnaireStepper'
import QuestionnaireStepperSwitcher from '@renderer/components/QuestionnaireStepper.Switcher'
import { useQuestionnaireStepper } from '@renderer/components/QuestionnaireStepper.hooks'
import ScoreCard from '@renderer/components/ScoreCard'
import SuggestedProductsCard from '@renderer/components/SuggestedProductsCard'

const ProfilationPageContent = () => {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [importCardVisible, setImportCardVisible] = useState(false)
  const { token } = theme.useToken()
  const screens = Grid.useBreakpoint()
  const isMobile = !screens.sm
  const marginXS = token.marginXS
  const questionnaireModel = useQuestionnaireStepper()
  const importAsModal = !screens.lg

  useEffect(() => {
    if (importAsModal) {
      setImportCardVisible(false)
    } else {
      setImportModalOpen(false)
    }
  }, [importAsModal])

  const activeKey = searchParams.get('tab') ?? 'questionnaire'

  const handleTabChange = (key: string) => {
    if (key === 'questionnaire') {
      searchParams.delete('tab')
      setSearchParams(searchParams, { replace: true })
    } else {
      setSearchParams({ tab: key }, { replace: true })
    }
  }

  const handleImportToggle = useCallback(() => {
    if (importAsModal) {
      setImportModalOpen(true)
    } else {
      setImportCardVisible((prev) => !prev)
    }
  }, [importAsModal])

  const importActive = importAsModal ? importModalOpen : importCardVisible

  const tabs = useMemo(() => [
    {
      key: 'questionnaire',
      label: t('profilation.tabs.questionnaire'),
      children: (
        <Space direction="vertical" size="middle" style={{ width: '100%', marginTop: marginXS }}>
          <Row gutter={[16, 16]} align="middle" wrap style={{ width: '100%' }}>
            <Col xs={24} lg={6} style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <Button
                icon={<InboxOutlined />}
                onClick={handleImportToggle}
                type={importActive ? 'default' : 'primary'}
                style={{ width: '100%', maxWidth: 220 }}
              >
                {importActive && !importAsModal
                  ? t('demoUpload.actions.close')
                  : t('demoUpload.actions.open')}
              </Button>
            </Col>
            <Col xs={24} lg={18} style={{ minWidth: 0 }}>
              <QuestionnaireStepperSwitcher model={questionnaireModel} />
            </Col>
          </Row>
          <Row gutter={[16, 16]} align="stretch">
            <Col xs={24} xl={!importAsModal && importCardVisible ? 14 : 24}>
              <QuestionnaireStepper model={questionnaireModel} />
            </Col>
            {!importAsModal && importCardVisible ? (
              <Col xs={24} xl={10}>
                <DemoUploadCard />
              </Col>
            ) : null}
          </Row>
        </Space>
      )
    },
    {
      key: 'results',
      label: `${t('profilation.tabs.suggestions')} · ${t('profilation.tabs.risk')}`,
      children: (
        <Space direction="vertical" size={token.marginLG} style={{ width: '100%', marginTop: marginXS }}>
          <Row gutter={[16, 16]} align="stretch">
            <Col xs={24} xl={9}>
              <ScoreCard />
            </Col>
            <Col xs={24} xl={15}>
              <SuggestedProductsCard />
            </Col>
          </Row>
        </Space>
      )
    },
    {
      key: 'settings',
      label: t('profilation.tabs.settings'),
      children: <CertificateCard />
    }
  ], [handleImportToggle, importAsModal, importActive, marginXS, questionnaireModel, t, token.marginLG])

  return (
    <>
      <Tabs
        items={tabs}
        tabBarGutter={24}
        tabBarStyle={{ marginBottom: token.marginSM }}
        style={{ width: '100%' }}
        destroyInactiveTabPane={false}
        activeKey={activeKey}
        onChange={handleTabChange}
      />
      <Modal
        open={importAsModal && importModalOpen}
        footer={null}
        onCancel={() => setImportModalOpen(false)}
        title={t('demoUpload.title')}
        centered
        width={isMobile ? '100%' : 640}
        style={{ top: isMobile ? 12 : 80 }}
        bodyStyle={{ padding: isMobile ? token.paddingLG : token.paddingMD }}
      >
        <DemoUploadCard />
      </Modal>
    </>
  )
}

export default ProfilationPageContent
