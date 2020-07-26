import React from "react";
import {
    Modal,
    Tab,
    Tabs,
    DataTable,
    Table,
    TableContainer,
    TableRow,
    TableHead,
    TableHeader,
    TableCell,
    TableBody
} from 'carbon-components-react';

import {
    DonutChart,
    AreaChart 
} from '@carbon/charts-react';
import "@carbon/charts/styles-g10.css";
import { SDGS } from '../data/sdg';
import moment from 'moment';
import startCase from 'lodash/startCase';
import times from 'lodash/times';
import toLower from 'lodash/toLower';
import faker from 'faker';
import { indexOf } from "lodash";

function LivabilityModal({...props}) {

    const random = (min: number, max: number) => { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    const data = SDGS.map((goal, i) => {
        return  {
            color: goal.color,
            group: goal.title,
            value: random(100, 3030)
        };
    }).sort(() => Math.random() - 0.5);

    const councilName = startCase(toLower(props.council));
    const modalHeading = `${councilName} Council`

    const options = {
        title: `Most Valued Goals in ${councilName}`,
        resizable: true,
        width: '100%',
        donut: {
            center: {
                label: "Responses"
            }
        },
        height: "400px"
    };

    const years = ["2020", "2019", "2018", "2017", "2016", "2015"];

    const timeSeriesData: any = [ ...data ].map(goal => {
        return years.map(year => { 
            return {
                group: goal.group,
                date: moment(year).format(),
                value: random(goal.value, goal.value + 1200),
            }
        });
    });

    const mergedTimeSeriesData = [].concat( ...timeSeriesData );

    const timeSeriesOptions = {
        "title": "Development Goal Community Prioritisation",
        "axes": {
          "bottom": {
            "title": "SDG Rating by Year",
            "mapsTo": "date",
            "scaleType": "time"
          },
          "left": {
            "mapsTo": "value",
            "scaleType": "linear"
          }
        },
        "curve": "curveNatural",
        "height": "400px"
    }

    const headerData = [
        {
          header: "Name",
          key: "name",
        },
        {
          header: "Comment",
          key: "comment",
        },
        {
          header: "Date",
          key: "date",
        },
    ];

    const rowData: any = times(5, (i) => {
        return {
            id: `${i}`,
            name: faker.name.findName(),
            comment: faker.lorem.sentence(),
            date: moment(faker.date.past()).format('LL'),
        }
    });

    return (
        <Modal aria-label={`Content for ${props.council}`} key={props.council} passiveModal modalLabel={'Local Goverment Area'} modalHeading={modalHeading} open={props.open} onRequestClose={() => props.onRequestClose(undefined)}>
                <Tabs type='container'>
                    <Tab
                    href="#"
                    id="tab-1"
                    label="Quantified"
                    >
                    <div className="some-content">
                        <DonutChart
                            data={data}
                            options={options}>
                        </DonutChart>
                    </div>
                    </Tab>
                    <Tab
                        href="#"
                        id="tab-2"
                        label="Divergence"
                    >
                        <AreaChart
                            data={mergedTimeSeriesData}
                            options={timeSeriesOptions}
                        />
                    </Tab>
                    <Tab
                        href="#"
                        id="tab-2"
                        label="Sentiment"
                        >
                        <DataTable
                            rows={rowData}
                            headers={headerData}
                            render={({ rows, headers, getHeaderProps }) => (
                            <TableContainer title="Responses">
                            <Table>
                                <TableHead>
                                <TableRow>
                                    {headers.map(header => (
                                    <TableHeader {...getHeaderProps({ header })}>
                                        {header.header}
                                    </TableHeader>
                                    ))}
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {rows.map(row => (
                                    <TableRow key={row.id}>
                                    {row.cells.map(cell => (
                                        <TableCell key={cell.id}>{cell.value}</TableCell>
                                    ))}
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </TableContainer>)}
        />

                    </Tab>
                </Tabs>
        </Modal>
    )
}

export default LivabilityModal;