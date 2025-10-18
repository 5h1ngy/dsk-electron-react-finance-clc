import { Col, Row, Space } from 'antd'

import QuestionnaireStepper from '@renderer/components/QuestionnaireStepper'
import ScoreCard from '@renderer/components/ScoreCard'
import SectionCompletionCard from '@renderer/components/SectionCompletionCard'
import SchemaSummaryCard from '@renderer/components/SchemaSummaryCard'
import DemoUploadCard from '@renderer/components/DemoUploadCard'

const WorkbenchPage = () => (
  <Space direction="vertical" size="large" style={{ width: '100%' }}>
    <Row gutter={[16, 16]}>
      <Col xs={24} xxl={16}>
        <Row gutter={[16, 16]}>
          <Col xs={24} xl={15}>
            <QuestionnaireStepper />
          </Col>
          <Col xs={24} xl={9}>
            <DemoUploadCard />
          </Col>
        </Row>
      </Col>
      <Col xs={24} xxl={8}>
        <SectionCompletionCard />
      </Col>
    </Row>
    <Row gutter={[16, 16]}>
      <Col xs={24} xl={12}>
        <ScoreCard />
      </Col>
      <Col xs={24} xl={12}>
        <SchemaSummaryCard />
      </Col>
    </Row>
  </Space>
)

export default WorkbenchPage
