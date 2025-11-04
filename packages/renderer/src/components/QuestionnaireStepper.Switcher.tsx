import { useMemo, useState } from 'react'

import { Button, Dropdown, Modal, Space, Steps, Tooltip, Grid, theme } from 'antd'
import type { MenuProps } from 'antd'
import { CheckCircleFilled, EllipsisOutlined } from '@ant-design/icons'

import type { QuestionnaireStepperModel } from '@renderer/components/QuestionnaireStepper'

interface QuestionnaireStepperSwitcherProps {
  model: QuestionnaireStepperModel
}

const QuestionnaireStepperSwitcher = ({ model }: QuestionnaireStepperSwitcherProps) => {
  const { token } = theme.useToken()
  const screens = Grid.useBreakpoint()
  const { sectionsProgress, currentStep, handleStepChange, steps } = model
  const [mobileOpen, setMobileOpen] = useState(false)

  if (!sectionsProgress.length) {
    return null
  }

  const isMobile = !screens.sm
  const isCompact = !isMobile && !screens.lg
  const currentSection = sectionsProgress[currentStep]

  const menuItems = useMemo<MenuProps['items']>(
    () =>
      sectionsProgress.map((section, index) => ({
        key: section.id,
        label: section.title,
        disabled: steps[index]?.disabled,
        icon:
          section.percent === 100 ? (
            <CheckCircleFilled style={{ color: token.colorSuccess }} />
          ) : undefined
      })),
    [sectionsProgress, steps, token.colorSuccess]
  )

  const handleSelect = (key: string) => {
    const index = sectionsProgress.findIndex((section) => section.id === key)
    if (index !== -1 && !steps[index]?.disabled) {
      handleStepChange(index)
    }
  }

  const renderSteps = (withOverflow = false) => (
    <Steps
      type="navigation"
      size="small"
      current={currentStep}
      onChange={(index) => {
        if (!steps[index]?.disabled) {
          handleStepChange(index)
        }
      }}
      style={{
        width: '100%',
        minWidth: withOverflow ? undefined : '100%',
        background: token.colorBgContainer,
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

  if (isMobile) {
    return (
      <>
        <Button
          block
          size="large"
          type="default"
          onClick={() => setMobileOpen(true)}
          style={{
            justifyContent: 'space-between',
            display: 'flex',
            alignItems: 'center',
            gap: token.marginSM,
            padding: `${token.paddingXS}px ${token.paddingMD}px`
          }}
        >
          <span style={{ flex: 1, textAlign: 'left' }}>{currentSection?.title}</span>
        </Button>
        <Modal
          open={mobileOpen}
          footer={null}
          onCancel={() => setMobileOpen(false)}
          title={currentSection?.title}
          closable
          centered
          width="100%"
          style={{ top: 16 }}
          bodyStyle={{ padding: token.paddingMD }}
          destroyOnClose
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
                    handleSelect(section.id)
                    setMobileOpen(false)
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

  if (isCompact) {
    return (
      <Space size={token.marginSM} style={{ width: '100%' }}>
        <div style={{ flex: 1, minWidth: 0, overflowX: 'auto' }}>
          {renderSteps(true)}
        </div>
        <Dropdown
          trigger={['click']}
          menu={{
            items: menuItems,
            onClick: ({ key }) => handleSelect(key)
          }}
        >
          <Button icon={<EllipsisOutlined />} shape="circle" />
        </Dropdown>
      </Space>
    )
  }

  return renderSteps()
}

export default QuestionnaireStepperSwitcher
