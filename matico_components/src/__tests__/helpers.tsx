import React from 'react'
import { Provider, defaultTheme } from '@adobe/react-spectrum'
import { RecoilRoot } from 'recoil'
import { render as testRender } from '@testing-library/react'
// import { App } from '@maticoapp/matico_types/spec'
// import { MaticoApp } from 'MaticoApp/MaticoApp'

export const TestWrapper = ({ children }: React.PropsWithChildren<unknown>) => {
  return (
    <RecoilRoot>
      <Provider theme={defaultTheme}>
        {children}
      </Provider>
    </RecoilRoot>
  )
}


export const render = (Component: React.ReactNode) => {
  return testRender(
    <TestWrapper>
      {Component}
    </TestWrapper>
  )
}

// export const renderWithAppSpec = (Component: React.ReactNode, appSpec: App) => {
//   return testRender(
//     <TestWrapper>
//       <MaticoApp spec={appSpec} />
//     </TestWrapper>
//   )
//
// }
