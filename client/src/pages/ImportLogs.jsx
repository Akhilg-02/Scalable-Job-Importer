
import { useEffect, useState } from 'react'
import axios from 'axios';

const apiUrl = 'http://localhost:8000'

const ImportLogs = () => {
    const [loading, setLoading] = useState(true);
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const fetchImportLogs = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/import-logs`);
                console.log("response", response)
                setLogs(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching import logs:', error);
            }
        };

        fetchImportLogs();
    }, []);
    return (
        <>
            <div style={{ padding: '2rem' }}>
                <h1>📦 Import History</h1>

                {loading ? (
                    <p>Loading logs...</p>
                ) : logs.length === 0 ? (
                    <p>No import logs available.</p>
                ) : (
                    <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
                        <thead style={{ backgroundColor: '#f4f4f4' }}>
                            <tr>
                                <th>File Name (URL)</th>
                                <th>ImportDateTime</th>
                                <th>Total</th>
                                <th>New</th>
                                <th>Updated</th>
                                <th>Failed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => {
                                const formattedDate = new Date(log.importDateTime)
                                    .toLocaleString('en-GB', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                        hour12: false,
                                    })
                                    .replace(',', '');

                                return (
                                    <tr key={log._id}>
                                        <td style={{ wordBreak: 'break-all' }}>{log.fileName}</td>
                                        <td>{formattedDate}</td>
                                        <td>{log.total}</td>
                                        <td style={{ color: 'green' }}>{log.new}</td>
                                        <td style={{ color: 'blue' }}>{log.updated}</td>
                                        <td style={{ color: 'red' }}>{log.failed}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                )}
            </div>

        </>
    )
}

export default ImportLogs