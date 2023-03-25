const trim = async (req, res, next) => {
    if (req.method === "POST") {
        for (const [key, value] of Object.entries(req.body)) {
            if (value && typeof value === "string") req.body[key] = value.trim();
        }
    }
    next();
};

export default trim