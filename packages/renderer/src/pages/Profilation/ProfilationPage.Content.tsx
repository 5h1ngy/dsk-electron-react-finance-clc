import { Button, Col, Row, Space, Tabs, theme } from 'antd'
import { useState, useMemo } from 'react'
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
  const [importVisible, setImportVisible] = useState(false)
  const { token } = theme.useToken()
  const marginXS = token.marginXS
  const questionnaireModel = useQuestionnaireStepper()

  const activeKey = searchParams.get('tab') ?? 'questionnaire'

  const handleTabChange = (key: string) => {
    if (key === 'questionnaire') {
      searchParams.delete('tab')
      setSearchParams(searchParams, { replace: true })
    } else {
      setSearchParams({ tab: key }, { replace: true })
    }
  }

  const tabs = useMemo(() => [
    {
      key: 'questionnaire',
      label: t('profilation.tabs.questionnaire'),
      children: (
        <Space direction="vertical" size="middle" style={{ width: '100%', marginTop: marginXS }}>
          <Row gutter={[16, 16]} align="middle" wrap style={{ width: '100%' }}>
            <Col xs={24} lg={18} style={{ minWidth: 0 }}>
              <div style={{ overflowX: 'auto', paddingBottom: token.paddingXXS }}>
                <QuestionnaireStepperSwitcher model={questionnaireModel} />
              </div>
            </Col>
            <Col xs={24} lg={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                icon={<InboxOutlined />}
                onClick={() => setImportVisible((prev) => !prev)}
                type={importVisible ? 'default' : 'primary'}
                style={{ width: '100%', maxWidth: 220 }}
              >
                {importVisible
                  ? t('demoUpload.actions.close')
                  : t('demoUpload.actions.open')}
              </Button>
            </Col>
          </Row>
          <Row gutter={[16, 16]} align="stretch">
            <Col xs={24} xl={importVisible ? 14 : 24}>
              <QuestionnaireStepper model={questionnaireModel} />
            </Col>
            {importVisible ? (
              <Col xs={24} xl={10}>
                <DemoUploadCard />
              </Col>
            ) : null}
          </Row>
        </Space>
      )
    },
    {
      key: 'suggestions',
      label: t('profilation.tabs.suggestions'),
      children: <SuggestedProductsCard />
    },
    {
      key: 'risk',
      label: t('profilation.tabs.risk'),
      children: <ScoreCard />
    },
    {
      key: 'settings',
      label: t('profilation.tabs.settings'),
      children: <CertificateCard />
    }
  ], [importVisible, marginXS, questionnaireModel, t])

  return (
    <Tabs
      items={tabs}
      tabBarGutter={24}
      tabBarStyle={{ marginBottom: token.marginSM }}
      style={{ width: '100%' }}
      destroyInactiveTabPane={false}
      activeKey={activeKey}
      onChange={handleTabChange}
    />
  )
}

export default ProfilationPageContent
