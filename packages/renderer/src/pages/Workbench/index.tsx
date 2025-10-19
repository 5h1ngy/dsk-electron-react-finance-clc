import { Col, Row, Space } from 'antd'

import DemoUploadCard from '@renderer/components/DemoUploadCard'
import QuestionnaireStepper from '@renderer/components/QuestionnaireStepper'
import SectionCompletionCard from '@renderer/components/SectionCompletionCard'
import SchemaSummaryCard from '@renderer/components/SchemaSummaryCard'
import ScoreCard from '@renderer/components/ScoreCard'

const WorkbenchPage = () => (
  <Space direction="vertical" size="large" style={{ width: '100%' }}>
    <Row gutter={[16, 16]} justify="center" align="stretch">
      <Col xs={24} xl={6}>
        <DemoUploadCard />
      </Col>
      <Col xs={24} xl={18}>
        <QuestionnaireStepper />
      </Col>
    </Row>
    <Row gutter={[16, 16]} justify="center" align="stretch">
      <Col xs={24} xl={12}>
        <SectionCompletionCard />
      </Col>
      <Col xs={24} xl={12}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <SchemaSummaryCard />
          <ScoreCard />
        </Space>
      </Col>
    </Row>
  </Space>
)

export default WorkbenchPage
