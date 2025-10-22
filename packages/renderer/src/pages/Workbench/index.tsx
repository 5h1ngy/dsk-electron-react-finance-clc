import { Col, Row, Space } from 'antd'

import CertificateCard from '@renderer/components/CertificateCard'
import DemoUploadCard from '@renderer/components/DemoUploadCard'
import QuestionnaireStepper from '@renderer/components/QuestionnaireStepper'
import SchemaSummaryCard from '@renderer/components/SchemaSummaryCard'
import ScoreCard from '@renderer/components/ScoreCard'
import SectionCompletionCard from '@renderer/components/SectionCompletionCard'
import SuggestedProductsCard from '@renderer/components/SuggestedProductsCard'

const WorkbenchPage = () => (
  <Space direction="vertical" size="large" style={{ width: '100%' }}>
    <Row gutter={[16, 16]} justify="center" align="stretch">
      <Col xs={24} xl={6}>
        <DemoUploadCard />
      </Col>
      <Col xs={24} xl={12}>
        <QuestionnaireStepper />
      </Col>
      <Col xs={24} xl={6}>
        <SectionCompletionCard />
      </Col>
    </Row>
    <Row gutter={[16, 16]} justify="center" align="stretch">
      <Col xs={24} xl={8}>
        <SchemaSummaryCard />
      </Col>
      <Col xs={24} xl={8}>
        <ScoreCard />
      </Col>
      <Col xs={24} xl={8}>
        <SuggestedProductsCard />
      </Col>
    </Row>
    <Row gutter={[16, 16]} justify="center" align="stretch">
      <Col xs={24} xl={8}>
        <CertificateCard />
      </Col>
    </Row>
  </Space>
)

export default WorkbenchPage
