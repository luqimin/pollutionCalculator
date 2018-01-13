
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Layout, Menu, Icon } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

import Calculator from './content/calculator';

import './style.css';

// import moment from 'moment';
// import 'moment/locale/zh-cn';
// moment.locale('zh-cn');

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            content: <Calculator />,
        };
    }

    onCollapse = (collapsed) => {
        this.setState({ collapsed });
    }

    onSelectMenu = (item) => {
        console.log(item);
        switch (item.key) {
            case "1":
                this.setState({
                    content: <Calculator />,
                });
                break;
            case "2":
                this.setState({
                    content: '历史纪录',
                });
                break;
            case "3":
                this.setState({
                    content: '柱状图',
                });
                break;
            case "4":
                this.setState({
                    content: '饼图',
                });
                break;

            default:
                break;
        }
    }

    render() {
        const mainContent = this.state.content;
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Sider
                    collapsible
                    collapsed={this.state.collapsed}
                    onCollapse={this.onCollapse}
                >
                    <div className="logo" />
                    <Menu
                        theme="dark"
                        defaultSelectedKeys={['1']}
                        mode="inline"
                        onSelect={this.onSelectMenu}
                    >
                        <Menu.Item key="1">
                            <Icon type="calculator" />
                            <span>污染计算</span>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Icon type="book" />
                            <span>历史纪录</span>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <Icon type="area-chart" />
                            <span>柱状图</span>
                        </Menu.Item>
                        <Menu.Item key="4">
                            <Icon type="pie-chart" />
                            <span>饼图</span>
                        </Menu.Item>
                        <SubMenu
                            key="sub1"
                            title={
                                <span>
                                    <Icon type="setting" />
                                    <span>设置</span>
                                </span>
                            }
                        >
                            <Menu.Item key="5">5</Menu.Item>
                            <Menu.Item key="6">6</Menu.Item>
                        </SubMenu>
                    </Menu>
                </Sider>
                <Layout>
                    <Header style={{ background: '#fff', paddingLeft: 20 }}>
                        污染计算
                    </Header>
                    <Content style={{ margin: '0 16px' }}>
                        <div style={{ padding: 24, minHeight: 360 }}>
                            {mainContent}
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        Created by LuQimin
                    </Footer>
                </Layout>
            </Layout>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));