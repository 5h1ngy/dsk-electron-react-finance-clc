import { HashRouter, Route, Routes } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import itIT from 'antd/locale/it_IT'
import { Provider } from 'react-redux'

import AppLayout from '@renderer/layout/AppLayout'
import WorkbenchPage from '@renderer/pages/Workbench'
import DiagnosticsPage from '@renderer/pages/Diagnostics'
import ProductsPage from '@renderer/pages/Products'
import { store } from '@renderer/store'
import { appTheme } from '@renderer/theme'
import '@renderer/i18n'

const App = () => (
  <Provider store={store}>
    <ConfigProvider locale={itIT} theme={appTheme}>
      <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppLayout>
          <Routes>
            <Route index element={<WorkbenchPage />} />
            <Route path="/diagnostics" element={<DiagnosticsPage />} />
            <Route path="/prodotti" element={<ProductsPage />} />
            <Route path="*" element={<WorkbenchPage />} />
          </Routes>
        </AppLayout>
      </HashRouter>
    </ConfigProvider>
  </Provider>
)

export default App
