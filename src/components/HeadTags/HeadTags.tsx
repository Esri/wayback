import React from 'react';
import { Helmet } from 'react-helmet';

import { isHostedOnLivingAtlasDomain } from '../../utils/Tier';

const HeadTags = () => {
    return isHostedOnLivingAtlasDomain ? (
        <Helmet>
            {/* add Adobe Analytics script */}
            <script src="//mtags.arcgis.com/tags-min.js"></script>
        </Helmet>
    ) : null;
};

export default HeadTags;
