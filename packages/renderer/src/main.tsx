import '@ant-design/v5-patch-for-react-19'
import 'antd/dist/reset.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'

const container = document.getElementById('root')

if (!container) {
  throw new Error('Root container not found')
}

document.body.style.margin = '0'
document.body.style.minHeight = '100vh'
document.body.style.fontFamily =
  "'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif"

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>
)
