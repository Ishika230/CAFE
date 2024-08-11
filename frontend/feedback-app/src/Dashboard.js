import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css'; // Importing the CSS file

const Dashboard = () => {
    const [reports, setReports] = useState([]);
    const [searchMonth, setSearchMonth] = useState('');
    const [filteredReports, setFilteredReports] = useState([]);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await axios.get('http://localhost:5000/reports/getReports');
                console.log(response);
                setReports(response.data);
                setFilteredReports(response.data);
            } catch (error) {
                console.error('Error fetching reports:', error);
            }
        };
        fetchReports();
    }, []);

    const handleDownload = (filename) => {
        window.open(`http://localhost:5000/reports/download/${filename}`, '_blank');
    };

    const handleSearch = () => {
        if (!searchMonth) {
            setFilteredReports(reports);
            return;
        }

        const [year, month] = searchMonth.split('-').map(Number);
        const filtered = reports.filter(report => {
            const reportDateRange = report.match(/(\d{4}-\d{2}-\d{2})/g);
            if (reportDateRange) {
                const [startDate, endDate] = reportDateRange.map(dateStr => new Date(dateStr));
                return (
                    (startDate.getFullYear() === year && startDate.getMonth() + 1 === month) ||
                    (endDate.getFullYear() === year && endDate.getMonth() + 1 === month)
                );
            }
            return false;
        });
        setFilteredReports(filtered);
    };

    return (
        <div className="dashboard-container">
            <h1>Reports Dashboard</h1>
            <div className="search-container">
                <input
                    type="month"
                    placeholder='June 2024'
                    value={searchMonth}
                    onChange={(e) => setSearchMonth(e.target.value)}
                />
                <button onClick={handleSearch} className='search-button'>Search</button>
            </div>
            <h2>Available Reports</h2>
            <div className="reports-list">
                {filteredReports.length > 0 ? (
                    filteredReports.map((report, index) => (
                        <div key={index} className="report-item">
                            <span>{report}</span>
                            <button onClick={() => handleDownload(report)}>Download</button>
                        </div>
                    ))
                ) : (
                    <p>No reports found.</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
