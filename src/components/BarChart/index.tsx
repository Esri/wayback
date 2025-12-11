/* Copyright 2024 Esri
 *
 * Licensed under the Apache License Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import './style.css';
import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

import { IWaybackItem } from '@typings/index';

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

const ContainerClassName = 'bar-chart-container';
const BarRectGroupClassName = 'wayback-release-bars';
const BarRectClassName = 'bar';

const BarChart: React.FC<IProps> = ({
    waybackItems,
    activeWaybackItem,
    rNum4WaybackItemsWithLocalChanges,
    shouldOnlyShowItemsWithLocalChange,
    onClick,
    onMouseEnter,
    onMouseOut,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [svg, setSvg] = useState<any>(null);

    const getBars = () => {
        if (!svg) return null;
        const bars = svg.selectAll('.' + BarRectClassName);
        return bars || null;
    };

    const drawBars = (
        svgElement: any,
        xScaleFunc: d3.ScaleTime<any, any>,
        chartHeight: number,
        chartWidth: number
    ) => {
        const BarWidth = chartWidth / waybackItems.length;

        const existingBars = svgElement.selectAll('.' + BarRectClassName);

        if (existingBars) {
            existingBars.remove().exit();
        }

        const bars = svgElement
            .append('g')
            .attr('class', BarRectGroupClassName)
            .selectAll('.' + BarRectClassName)
            .data(waybackItems)
            .enter()
            .append('rect')
            .attr('data-release-num', (d: IWaybackItem) => d.releaseNum)
            .attr('data-release-date', (d: IWaybackItem) => d.releaseDateLabel)
            .attr('class', (d: IWaybackItem) => {
                const classes = [BarRectClassName];

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
                return xScaleFunc(d.releaseDatetime);
            })
            .attr('y', 0)
            .attr('width', (d: IWaybackItem, i: number) => {
                return BarWidth;
            })
            .attr('height', chartHeight)
            .on('click', function () {
                const d = d3.select(this).data()[0] as IWaybackItem;

                if (!d) {
                    return;
                }

                onClick(d.releaseNum);
            })
            .on('mouseover', function () {
                const d = d3.select(this).data()[0] as IWaybackItem;

                if (!d) {
                    return;
                }

                onMouseEnter(d.releaseNum, true);
            })
            .on('mouseout', (d: IWaybackItem) => {
                onMouseOut();
            });
    };

    const initSvg = () => {
        const container = containerRef.current;
        if (!container) return;

        const margin = { top: 10, right: 15, bottom: 20, left: 15 };

        const chartWidth = container.offsetWidth - margin.left - margin.right;
        const chartHeight = container.offsetHeight - margin.top - margin.bottom;

        const xScaleFunc = d3
            .scaleTime()
            .range([0, chartWidth])
            .domain([
                waybackItems[waybackItems.length - 1].releaseDatetime,
                waybackItems[0].releaseDatetime,
            ]);

        const svgElement = d3
            .select(container)
            .append('svg')
            .attr('width', chartWidth + margin.left + margin.right)
            .attr('height', chartHeight + margin.top + margin.bottom)
            .attr('class', 'wayback-releases-overview-chart')
            .append('g')
            .attr(
                'transform',
                'translate(' + margin.left + ',' + margin.top + ')'
            );

        const xAxis = d3.axisBottom(xScaleFunc).ticks(5);

        svgElement
            .append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + chartHeight + ')')
            .call(xAxis);

        setSvg(svgElement);

        drawBars(svgElement, xScaleFunc, chartHeight, chartWidth);
    };

    // Initialize SVG on mount
    useEffect(() => {
        if (waybackItems && !svg) {
            initSvg();
        }
    }, [waybackItems, svg]);

    // Update active bar when activeWaybackItem changes
    useEffect(() => {
        const bars = getBars();

        if (bars) {
            bars.classed('is-active', false);

            bars.filter((d: IWaybackItem) => {
                return d.releaseNum === activeWaybackItem.releaseNum;
            }).classed('is-active', true);
        }
    }, [activeWaybackItem, svg]);

    // Update highlighted bars when rNum4WaybackItemsWithLocalChanges changes
    useEffect(() => {
        const bars = getBars();

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
    }, [rNum4WaybackItemsWithLocalChanges, svg]);

    // Toggle display items with local change
    useEffect(() => {
        const bars = getBars();

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
    }, [shouldOnlyShowItemsWithLocalChange, svg]);

    return (
        <div
            className={ContainerClassName}
            ref={containerRef}
            data-testid="releases-bar-chart"
            style={{
                width: '100%',
                height: '55px',
                marginBottom: '.5rem',
            }}
        ></div>
    );
};

export default BarChart;
