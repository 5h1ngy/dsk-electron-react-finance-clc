import { Button, Col, Row, Space, Tabs } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { InboxOutlined } from '@ant-design/icons'

import CertificateCard from '@renderer/components/CertificateCard'
import DemoUploadCard from '@renderer/components/DemoUploadCard'
import QuestionnaireStepper from '@renderer/components/QuestionnaireStepper'
import ScoreCard from '@renderer/components/ScoreCard'
import SectionCompletionCard from '@renderer/components/SectionCompletionCard'
import SuggestedProductsCard from '@renderer/components/SuggestedProductsCard'

const WorkbenchPageContent = () => {
  const { t } = useTranslation()
  const [importVisible, setImportVisible] = useState(false)

  const tabs = [
    {
      key: 'questionnaire',
      label: t('profilation.tabs.questionnaire'),
      children: (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <SectionCompletionCard />
          <Button
            icon={<InboxOutlined />}
            onClick={() => setImportVisible((prev) => !prev)}
            type={importVisible ? 'default' : 'primary'}
          >
            {importVisible
              ? t('demoUpload.actions.close')
              : t('demoUpload.actions.open')}
          </Button>
          <Row gutter={[16, 16]} align="stretch">
            <Col xs={24} xl={importVisible ? 14 : 24}>
              <QuestionnaireStepper />
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
