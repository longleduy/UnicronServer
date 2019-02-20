export const serverRespone = (req, res, next) => {
    let status = res.locals.status;
    let data;
    let message;
    if (status === 200) {
        data = res.locals.data;
    }
    else {
        message = res.locals.message;
    }
    res.status(status).json({ data, message });
}
