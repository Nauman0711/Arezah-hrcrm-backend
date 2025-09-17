const companyScope = (req, res, next) =>{
    try {
        if (!req.user || !req.user.company) {
            return res.status(403).json({ message: "Company context not found" });
        }
        req.companyId = req.user.company.toString();
        next();
    } catch (error) {
        console.error("Company scope middleware error:", error);
        res.status(500).json({ message: "Server error in company scope" });
    }
};
module.exports = companyScope;
