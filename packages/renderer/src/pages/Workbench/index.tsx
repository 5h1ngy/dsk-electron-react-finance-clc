import { Col, Row, Space } from 'antd'

import QuestionnaireStepper from '@renderer/components/QuestionnaireStepper'
import ScoreCard from '@renderer/components/ScoreCard'
import SectionCompletionCard from '@renderer/components/SectionCompletionCard'
import SchemaSummaryCard from '@renderer/components/SchemaSummaryCard'
import DemoUploadCard from '@renderer/components/DemoUploadCard'

const WorkbenchPage = () => (
  <Space direction="vertical" size="large" style={{ width: '100%' }}>
    <Row gutter={[16, 16]}>
      <Col xs={24} xl={14}>
        <QuestionnaireStepper />
      </Col>
      <Col xs={24} xl={10}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <ScoreCard />
          <SectionCompletionCard />
          <SchemaSummaryCard />
          <DemoUploadCard />
        </Space>
      </Col>
    </Row>
  </Space>
)

export default WorkbenchPage
