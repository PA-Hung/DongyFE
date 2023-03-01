const configURL = {
    BASE_URL: process.env.REACT_APP_BACKEND_URL,
};

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    configURL.BASE_URL = process.env.REACT_APP_BACKEND_URL;
}

export default configURL;