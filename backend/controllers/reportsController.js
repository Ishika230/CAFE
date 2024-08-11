const fs = require('fs');
const path = require('path');

const reportsDirectory = path.join(__dirname, '../reports'); // Replace 'path/to/reports' with the actual path

const reportsController = {
    getReports: async (req, res) => {
        fs.readdir(reportsDirectory, (err, files) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'Unable to retrieve reports' });
            }
            res.json(files);
        });
    },
    downloadReport: (req, res) => {
        const reportName = req.params.name;
        const reportPath = path.join(reportsDirectory, reportName);
        console.log(reportPath);
        
        res.download(reportPath, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Unable to download the report' });
            }
        });
    }
};

module.exports = reportsController;
