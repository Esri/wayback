const convertDateFromWaybackItemTitle = (dateString = '') => {
    const dateParts = dateString.split('-');
    const year = +dateParts[0];
    const mon = +dateParts[1] - 1;
    const day = +dateParts[2];
    return new Date(year, mon, day);
};

// the title of wayback item is like "World Imagery (Wayback 2014-02-20)",
// therefore need to call this method to extract "2014-02-20" from string
const extractDateFromWaybackItemTitle = (waybackItemTitle = '') => {
    const regexpYYYYMMDD = /\d{4}-\d{2}-\d{2}/g;
    const results = waybackItemTitle.match(regexpYYYYMMDD);

    const dateString = results.length ? results[0] : waybackItemTitle;
    const datetime = convertDateFromWaybackItemTitle(dateString);

    return {
        releaseDateLabel: dateString,
        releaseDatetime: datetime,
    };
};

export { extractDateFromWaybackItemTitle };
