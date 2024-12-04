import { Layout } from 'antd'
// import { Content } from 'antd/es/layout/layout'
import React from 'react'
const { Content } = Layout;
export const Dashboard = () => {
  return (
    <>
            

    <Layout>
        <Content style={{ padding: '24px' }}>
            <div>
                    Hello words <br />
                    Change sidebar menu: go to context/resoures.tsx <br />
                    components can put into /Components (like div Order /div)
            </div>
        </Content>
    </Layout>
    </>
  )
}

