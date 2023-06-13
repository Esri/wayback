import { getJobOutput } from './wayportGPService';

export const downloadExportBundle = async (GPJobId: string) => {
    const res = await getJobOutput(GPJobId);

    const url = res?.value?.url;

    if (!url) {
        throw Error('output tile package is no longer available');
    }

    window.open(res?.value?.url, '_blank');
};
