import './style.css';
import React from 'react';
import * as d3 from 'd3';

import { IWaybackItem } from '../../types';

interface IProps {
    waybackItems: Array<IWaybackItem>;
    activeWaybackItem: IWaybackItem;
    rNum4WaybackItemsWithLocalChanges: Array<number>;
    shouldOnlyShowItemsWithLocalChange: boolean;

    onClick?: (releaseNum: number) => void;
    onMouseEnter?: (
        releaseNum: number,
        shouldShowPreviewItemTitle: boolean
    ) => void;
    onMouseOut?: () => void;
}

interface IState {
    svg: any;
    height: number;
    width: number;
    xScale: d3.ScaleTime<any, any>;
}

class BarChart extends React.PureComponent<IProps, IState> {
    private readonly ContainerClassName = 'bar-chart-container';
    private readonly BarRectGroupClassName = 'wayback-release-bars';
    private readonly BarRectClassName = 'bar';
    private containerRef = React.createRef<HTMLDivElement>();

    constructor(props: IProps) {
        super(props);

        this.state = {
            svg: null,
            xScale: null,
            height: 0,
            width: 0,
        };
    }

    initSvg() {
        const { waybackItems } = this.props;

        const container = this.containerRef.current;
        const margin = { top: 10, right: 15, bottom: 20, left: 15 };

        const width = container.offsetWidth - margin.left - margin.right;
        const height = container.offsetHeight - margin.top - margin.bottom;

        const xScale = d3
            .scaleTime()
            .range([0, width])
            .domain([
                waybackItems[waybackItems.length - 1].releaseDatetime,
                waybackItems[0].releaseDatetime,
            ]);

        const svg = d3
            .select(container)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .attr('class', 'wayback-releases-overview-chart')
            .append('g')
            .attr(
                'transform',
                'translate(' + margin.left + ',' + margin.top + ')'
            );

        const xAxis = d3.axisBottom(xScale).ticks(5);

        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);

        this.setState(
            {
                svg,
                xScale,
                width,
                height,
            },
            () => {
                this.drawBars();
            }
        );
    }

    drawBars() {
        const { svg, xScale, height, width } = this.state;
        const {
            waybackItems,
            activeWaybackItem,
            rNum4WaybackItemsWithLocalChanges,
            shouldOnlyShowItemsWithLocalChange,
            onClick,
            onMouseEnter,
            onMouseOut,
        } = this.props;

        const BarWidth = width / waybackItems.length;

        const existingBars = svg.selectAll('.' + this.BarRectClassName);

        if (existingBars) {
            existingBars.remove().exit();
        }

        const bars = svg
            .append('g')
            .attr('class', this.BarRectGroupClassName)
            .selectAll('.' + this.BarRectClassName)
            .data(waybackItems)
            .enter()
            .append('rect')
            .attr('class', (d: IWaybackItem) => {
                const classes = [this.BarRectClassName];

                const hasLocalChange =
                    rNum4WaybackItemsWithLocalChanges.includes(d.releaseNum);

                if (shouldOnlyShowItemsWithLocalChange && !hasLocalChange) {
                    classes.push('is-hide');
                }

                if (hasLocalChange) {
                    classes.push('is-highlighted');
                }

                if (d.releaseNum === activeWaybackItem.releaseNum) {
                    classes.push('is-active');
                }

                return classes.join(' ');
            })
            .attr('x', (d: IWaybackItem) => {
                return xScale(d.releaseDatetime);
            })
            .attr('y', 0)
            .attr('width', (d: IWaybackItem, i: number) => {
                // return d.isHighlighted ? 4 : barWidth;
                return BarWidth;
            })
            .attr('height', height)
            .on('click', (d: IWaybackItem) => {
                onClick(d.releaseNum);
            })
            .on('mouseover', (d: IWaybackItem) => {
                onMouseEnter(d.releaseNum, true);
            })
            .on('mouseout', (d: IWaybackItem) => {
                onMouseOut();
            });
    }

    getBars() {
        const { svg } = this.state;
        const bars = svg.selectAll('.' + this.BarRectClassName);
        return bars || null;
    }

    setActiveBar() {
        const { activeWaybackItem } = this.props;

        const bars = this.getBars();

        if (bars) {
            bars.classed('is-active', false);

            bars.filter((d: IWaybackItem) => {
                return d.releaseNum === activeWaybackItem.releaseNum;
            }).classed('is-active', true);
        }
    }

    setHighlightedBars() {
        const {
            rNum4WaybackItemsWithLocalChanges,
            shouldOnlyShowItemsWithLocalChange,
        } = this.props;
        const bars = this.getBars();

        if (bars) {
            bars.classed('is-highlighted', false);

            bars.filter((d: IWaybackItem) => {
                return (
                    rNum4WaybackItemsWithLocalChanges.indexOf(d.releaseNum) > -1
                );
            })
                .classed('is-highlighted', true)
                .classed('is-hide', false);

            if (shouldOnlyShowItemsWithLocalChange) {
                bars.filter((d: IWaybackItem) => {
                    return (
                        rNum4WaybackItemsWithLocalChanges.indexOf(
                            d.releaseNum
                        ) === -1
                    );
                }).classed('is-hide', true);
            }
        }
    }

    toggleDisplayItemsWithLocalChange() {
        const {
            shouldOnlyShowItemsWithLocalChange,
            rNum4WaybackItemsWithLocalChanges,
        } = this.props;

        const bars = this.getBars();

        if (bars) {
            bars.classed('is-hide', false);

            if (shouldOnlyShowItemsWithLocalChange) {
                bars.filter((d: IWaybackItem) => {
                    return (
                        rNum4WaybackItemsWithLocalChanges.indexOf(
                            d.releaseNum
                        ) === -1
                    );
                }).classed('is-hide', true);
            }
        }
    }

    componentDidMount() {
        const { svg } = this.state;
        const { waybackItems } = this.props;

        if (!svg && waybackItems) {
            this.initSvg();
        }
    }

    componentDidUpdate(prevProps: IProps, prevState: IState) {
        if (prevProps.activeWaybackItem !== this.props.activeWaybackItem) {
            this.setActiveBar();
        }

        if (
            prevProps.rNum4WaybackItemsWithLocalChanges !==
            this.props.rNum4WaybackItemsWithLocalChanges
        ) {
            this.setHighlightedBars();
        }

        if (
            prevProps.shouldOnlyShowItemsWithLocalChange !==
            this.props.shouldOnlyShowItemsWithLocalChange
        ) {
            this.toggleDisplayItemsWithLocalChange();
        }
    }

    render() {
        return (
            <div
                className={this.ContainerClassName}
                ref={this.containerRef}
                style={{
                    width: '100%',
                    height: '55px',
                    marginBottom: '.5rem',
                }}
            ></div>
        );
    }
}

export default BarChart;
