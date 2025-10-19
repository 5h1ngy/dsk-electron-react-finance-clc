import { Col, Row, Space } from 'antd'

import QuestionnaireStepper from '@renderer/components/QuestionnaireStepper'
import ScoreCard from '@renderer/components/ScoreCard'
import SectionCompletionCard from '@renderer/components/SectionCompletionCard'
import SchemaSummaryCard from '@renderer/components/SchemaSummaryCard'
import DemoUploadCard from '@renderer/components/DemoUploadCard'

const WorkbenchPage = () => (
  <Space direction="vertical" size="large" style={{ width: '100%' }}>
    <Row gutter={[16, 16]} align="stretch">
      <Col xs={24} lg={6} style={{ display: 'flex', minWidth: 0 }}>
        <DemoUploadCard />
      </Col>
      <Col xs={24} lg={18} style={{ display: 'flex', minWidth: 0 }}>
        <QuestionnaireStepper />
      </Col>
    </Row>
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={8}>
        <SchemaSummaryCard />
      </Col>
      <Col xs={24} lg={8}>
        <SectionCompletionCard />
      </Col>
      <Col xs={24} lg={8}>
        <ScoreCard />
      </Col>
    </Row>
  </Space>
)

export default WorkbenchPage
