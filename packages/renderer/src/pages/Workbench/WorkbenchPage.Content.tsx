import { Col, Row, Space, Tabs } from 'antd'
import { useTranslation } from 'react-i18next'

import CertificateCard from '@renderer/components/CertificateCard'
import DemoUploadCard from '@renderer/components/DemoUploadCard'
import QuestionnaireStepper from '@renderer/components/QuestionnaireStepper'
import ScoreCard from '@renderer/components/ScoreCard'
import SectionCompletionCard from '@renderer/components/SectionCompletionCard'
import SuggestedProductsCard from '@renderer/components/SuggestedProductsCard'

const WorkbenchPageContent = () => {
  const { t } = useTranslation()

  const tabs = [
    {
      key: 'questionnaire',
      label: t('profilation.tabs.questionnaire'),
      children: (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <SectionCompletionCard />
          <Row gutter={[16, 16]} align="stretch">
            <Col xs={24} xl={14}>
              <QuestionnaireStepper />
            </Col>
            <Col xs={24} xl={10}>
              <DemoUploadCard />
            </Col>
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
  ]

  return (
    <Tabs
      items={tabs}
      tabBarGutter={16}
      style={{ width: '100%' }}
      destroyInactiveTabPane={false}
    />
  )
}

export default WorkbenchPageContent
