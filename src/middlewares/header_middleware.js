export const headerMiddleware =  (req, res, next) => { 
    res.header('Access-Control-Allow-Origin', "https://192.168.10.117");
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization ');
    next();
};