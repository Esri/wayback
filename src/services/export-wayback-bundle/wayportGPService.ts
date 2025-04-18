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

import { IExtent } from '@esri/arcgis-rest-request';
import { tier } from '@utils/Tier';
import { geographicToWebMercator } from '@arcgis/core/geometry/support/webMercatorUtils';
import Extent from '@arcgis/core/geometry/Extent';
import axios from 'axios';
import { getToken } from '@utils/Esri-OAuth';

type GPJobStatus =
    | 'esriJobSubmitted'
    | 'esriJobExecuting'
    | 'esriJobSucceeded'
    | 'esriJobFailed';

type SubmitJobParams = {
    /**
     * map extent of this job
     */
    extent: IExtent;
    /**
     * identifier of a wayback item (e.g. `WB_2014_R01`) that will be used as clump name
     */
    layerIdentifier: string;
    /**
     * user selected zoom levels
     */
    levels: number[];
};

type SubmitJobResponse = {
    jobId: string;
    jobStatus: GPJobStatus;
};

type CheckJobStatusResponse = {
    jobId: string;
    jobStatus: GPJobStatus;
    results?: {
        output: {
            paramUrl: string;
        };
    };
    progress?: {
        type?: string;
        message?: string;
    };
    messages?: {
        type?: string;
        description?: string;
    }[];
};

type GetJobOutputResponse = {
    paramName: string;
    dataType: string;
    value: {
        /**
         * @example
         * https://34.220.147.218:6443/arcgis/rest/directories/arcgisjobs/wayport_gpserver/j94219d68f2874618a5c778db93a1ed9b/scratch/wayport.tpkx
         */
        url: string;
    };
};

export type WayportTilePackageInfo = {
    url: string;
    size: number;
};

const WAYPORT_GP_SERVICE_ROOT_PROD =
    'https://wayport.maptiles.arcgis.com/arcgis/rest/services/Wayport/GPServer/Wayport';
const WAYPORT_GP_SERVICE_ROOT_DEV =
    'https://wayportdev.maptiles.arcgis.com/arcgis/rest/services/Wayport/GPServer/Wayport';

// const WAYPORT_GP_SERVICE_ROOT = getServiceUrl('wayback-export-base');

/**
 * The root URL of the Wayport GP service.
 */
const WAYPORT_GP_SERVICE_ROOT =
    tier === 'production'
        ? WAYPORT_GP_SERVICE_ROOT_PROD
        : WAYPORT_GP_SERVICE_ROOT_DEV;

/**
 *
 * @param param0
 * @returns
 *
 * @see https://developers.arcgis.com/rest/services-reference/enterprise/submit-gp-job.htm
 */
export const submitJob = async ({
    extent,
    layerIdentifier,
    levels,
}: SubmitJobParams): Promise<SubmitJobResponse> => {
    // the GP service prefers extent in web mercator projection
    const extentInWebMercator = geographicToWebMercator(
        new Extent({
            xmin: extent.xmin,
            ymin: extent.ymin,
            xmax: extent.xmax,
            ymax: extent.ymax,
            spatialReference: {
                wkid: 4326,
            },
        })
    ) as Extent;

    const [minZoom, maxZoom] = levels;

    const { xmin, ymin, xmax, ymax } = extentInWebMercator;

    const params = new URLSearchParams({
        f: 'json',
        token: getToken(),
        clump: layerIdentifier,
        levels: `${minZoom}-${maxZoom}`,
        extent: `${xmin} ${ymin} ${xmax} ${ymax} PROJCS["WGS_1984_Web_Mercator_Auxiliary_Sphere",GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Mercator_Auxiliary_Sphere"],PARAMETER["False_Easting",0.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",0.0],PARAMETER["Standard_Parallel_1",0.0],PARAMETER["Auxiliary_Sphere_Type",0.0],UNIT["Meter",1.0]]`,
    });

    const res = await fetch(
        `${WAYPORT_GP_SERVICE_ROOT}/submitJob?${params.toString()}`
    );

    const data = await res.json();

    if (data.error) {
        throw data.error;
    }

    return data as SubmitJobResponse;
};

export const checkJobStatus = async (
    jobId: string
): Promise<CheckJobStatusResponse> => {
    const res = await fetch(
        `${WAYPORT_GP_SERVICE_ROOT}/jobs/${jobId}?f=json&token=${getToken()}`
    );

    const data = await res.json();

    return data as CheckJobStatusResponse;
};

export const getJobOutputInfo = async (
    jobId: string
): Promise<WayportTilePackageInfo> => {
    const outputRes = await fetch(
        `${WAYPORT_GP_SERVICE_ROOT}/jobs/${jobId}/results/output?f=json&token=${getToken()}`
    );

    const data = (await outputRes.json()) as GetJobOutputResponse;

    const url = data?.value?.url;

    if (!url) {
        return null;
    }

    const tilePackageHeaders = await fetch(url, {
        method: 'HEAD',
    });

    return {
        url,
        size: +tilePackageHeaders.headers.get('Content-Length'),
    };
};
