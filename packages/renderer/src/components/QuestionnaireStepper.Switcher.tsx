import { useState } from 'react'

import { Button, Modal, Space, Steps, Tooltip, Grid, theme } from 'antd'
import { CheckCircleFilled, EllipsisOutlined } from '@ant-design/icons'

import type { QuestionnaireStepperModel } from '@renderer/components/QuestionnaireStepper'

interface QuestionnaireStepperSwitcherProps {
  model: QuestionnaireStepperModel
}

const QuestionnaireStepperSwitcher = ({ model }: QuestionnaireStepperSwitcherProps) => {
  const { token } = theme.useToken()
  const screens = Grid.useBreakpoint()
  const { sectionsProgress, currentStep, handleStepChange, steps } = model
  const [modalOpen, setModalOpen] = useState(false)

  const hasSections = sectionsProgress.length > 0
  const isMobile = !screens.sm
  const useModalSwitcher = !screens.lg
  const currentSection = hasSections ? sectionsProgress[currentStep] : undefined

  if (!hasSections) {
    return null
  }

  const renderSteps = () => (
    <Steps
      size="small"
      current={currentStep}
      onChange={(index) => {
        if (!steps[index]?.disabled) {
          handleStepChange(index)
        }
      }}
      style={{
        width: '100%',
        background: 'transparent',
        borderRadius: token.borderRadiusLG,
        padding: `${token.paddingXS}px ${token.paddingMD}px`
      }}
      items={sectionsProgress.map((section, index) => ({
        title: (
          <Tooltip title={`${section.percent}%`}>
            <span>{section.title}</span>
          </Tooltip>
        ),
        status:
          section.percent === 100 ? 'finish' : index === currentStep ? 'process' : 'wait',
        disabled: steps[index]?.disabled,
        icon:
          section.percent === 100 ? (
            <CheckCircleFilled style={{ color: token.colorSuccess }} />
          ) : undefined
      }))}
    />
  )

  if (useModalSwitcher) {
    const modalWidth = isMobile ? '100%' : 520
    const modalTop = isMobile ? 16 : 80
    const modalPadding = isMobile ? token.paddingLG : token.paddingMD

    return (
      <>
        <Button
          block={isMobile}
          size="large"
          type="default"
          onClick={() => setModalOpen(true)}
          icon={<EllipsisOutlined />}
          style={{
            justifyContent: 'space-between',
            display: 'flex',
            alignItems: 'center',
            gap: token.marginSM,
            padding: `${token.paddingXS}px ${token.paddingMD}px`
          }}
        >
          <span style={{ flex: 1, textAlign: 'left' }}>
            {currentSection?.title ?? ''}
          </span>
        </Button>
        <Modal
          open={modalOpen}
          footer={null}
          onCancel={() => setModalOpen(false)}
          title={currentSection?.title}
          closable
          centered
          width={modalWidth}
          style={{ top: modalTop }}
          bodyStyle={{ padding: modalPadding }}
        >
          <Space direction="vertical" style={{ width: '100%' }} size={token.marginSM}>
            {sectionsProgress.map((section, index) => {
              const selected = index === currentStep
              return (
                <Button
                  key={section.id}
                  block
                  type={selected ? 'primary' : 'default'}
                  icon={
                    section.percent === 100 ? (
                      <CheckCircleFilled
                        style={{ color: selected ? undefined : token.colorSuccess }}
                      />
                    ) : undefined
                  }
                  onClick={() => {
                    if (!steps[index]?.disabled) {
                      handleStepChange(index)
                      setModalOpen(false)
                    }
                  }}
                  disabled={steps[index]?.disabled}
                >
                  {section.title}
                </Button>
              )
            })}
          </Space>
        </Modal>
      </>
    )
  }

  return renderSteps()
}

export default QuestionnaireStepperSwitcher
