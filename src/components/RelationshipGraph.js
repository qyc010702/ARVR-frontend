import ReactECharts from 'echarts-for-react';
import React from 'react'; // Ensure that React is imported

class RelationshipGraph extends React.Component {
    componentDidMount() {
        this.initChart();
    }

    initChart() {
        const { onNodeClick,graphData} = this.props;
        this.chart = this.echarts_react.getEchartsInstance();
        // 在这里配置关系图谱数据
        const option = {
            // ECharts 配置选项
            title: {
                text: '关系图谱示例',
            },
            tooltip: {
                show: false,
            },
            animationDurationUpdate: 1500,
            animationEasingUpdate: 'quinticInOut',
        };

        // 将配置项设置到图表中
        this.chart.setOption(option);

        // 监听节点点击事件
        this.chart.on('click', (params) => {
            // 处理节点点击事件，打开模态框
            console.log('Node clicked:', params);
            if (onNodeClick) {
                onNodeClick(params.data);
            }
        });
    }

    getOption = () => {
        const { graphData } = this.props;

        return {
            title: {
                text: '关系图谱示例',
            },
            tooltip: {
                show: false,
            },
            animationDurationUpdate: 1500,
            animationEasingUpdate: 'quinticInOut',
            series: [
                {
                    type: 'graph',
                    layout: 'force',
                    roam: true,
                    force: {
                        repulsion: 500,
                        gravity: 0.1,
                        edgeLength: 150,
                        layoutAnimation: true,
                    },
                    edgeSymbol: ['arrow', 'arrow'], // 设置边的箭头样式，数组中第一个元素表示起点箭头，第二个元素表示终点箭头
                    edgeSymbolSize: [5, 10], // 设置箭头大小，数组中第一个元素表示起点箭头大小，第二个元素表示终点箭头大小
                    avoidLabelOverlap: true, // 避免节点标签重叠
                    emphasis: {
                        focus: 'adjacency',
                        lineStyle: {
                            width: 5,
                        },
                    },
                    data: graphData.nodes.map(node => ({
                        name: node.name,
                        description: node.condition,
                        body:node.body,
                        type:node.type,
                        key:node.key,
                        symbolSize: 50,
                        label: {
                            show: true,
                            position: 'right',
                        },
                        draggable: true,
                        events: {
                            click: this.handleNodeClick,
                        },
                        itemStyle: {
                            borderWidth: 1,
                            borderColor: '#fff',
                        },
                        emphasis: {
                            focus: 'adjacency',
                            lineStyle: {
                                width: 5,
                            },
                            itemStyle: {
                                borderColor: 'red',
                                borderWidth: 2,
                            },
                        },
                    })),
                    links: graphData.links,
                },
            ],
        };
    };

    componentWillUnmount() {
        if (this.chart) {
            this.chart.dispose();
        }
    }

    render() {
        return (
            <ReactECharts
                ref={(e) => { this.echarts_react = e; }}
                option={this.getOption()}
                style={{ width: '100%', height: '400px' }}
            />
        );
    }
}

export default RelationshipGraph;
