import { Upload, message } from 'antd'
import type { UploadProps } from 'antd'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { arrayBufferToBase64, extractCertificateSummary } from '@engines/signature'
import { useAppDispatch, useAppSelector } from '@renderer/store/hooks'
import { selectCertificate, setCertificate } from '@renderer/store/slices/workspace'

const readFileBase64 = (file: File, translate: (key: string) => string): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error(translate('certificate.messages.fileRead')))
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(arrayBufferToBase64(reader.result))
      } else {
        reject(new Error(translate('certificate.messages.unsupported')))
      }
    }
    reader.readAsArrayBuffer(file)
  })

export const useCertificateCard = () => {
  const dispatch = useAppDispatch()
  const certificate = useAppSelector(selectCertificate)
  const [verifyModalOpen, setVerifyModalOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [verifying, setVerifying] = useState(false)
  const { t } = useTranslation()

  const summary = useMemo(() => certificate?.summary, [certificate])

  const handleUpload: UploadProps['beforeUpload'] = async (file) => {
    try {
      const base64 = await readFileBase64(file, t)
      dispatch(
        setCertificate({
          fileName: file.name,
          loadedAt: new Date().toISOString(),
          base64
        })
      )
      message.success(t('certificate.messages.uploaded'))
    } catch (error) {
      message.error(error instanceof Error ? error.message : t('certificate.messages.uploadError'))
    }
    return Upload.LIST_IGNORE
  }

  const handleVerify = useCallback(async () => {
    if (!certificate) {
      return
    }
    if (!password) {
      message.warning(t('certificate.messages.passwordMissing'))
      return
    }
    setVerifying(true)
    try {
      const certificateSummary = extractCertificateSummary(certificate.base64, password)
      dispatch(setCertificate({ ...certificate, summary: certificateSummary }))
      message.success(t('certificate.messages.verified'))
      setVerifyModalOpen(false)
      setPassword('')
    } catch (error) {
      message.error(error instanceof Error ? error.message : t('certificate.messages.verifyError'))
    } finally {
      setVerifying(false)
    }
  }, [certificate, password, dispatch, t])

  const handleClear = useCallback(() => {
    dispatch(setCertificate(undefined))
    setPassword('')
    message.info(t('certificate.messages.removed'))
  }, [dispatch, t])

  const openVerifyModal = useCallback(() => setVerifyModalOpen(true), [])
  const closeVerifyModal = useCallback(() => {
    setVerifyModalOpen(false)
    setPassword('')
  }, [])

  return {
    certificate,
    summary,
    verifyModalOpen,
    password,
    verifying,
    handleUpload,
    handleVerify,
    handleClear,
    openVerifyModal,
    closeVerifyModal,
    setPassword
  }
}
