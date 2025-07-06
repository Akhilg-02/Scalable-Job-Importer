
import { useEffect, useState } from 'react'
import axios from 'axios';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";

const apiUrl = import.meta.env.VITE_API_URL  // || "http://localhost:8000" 


const columns = [
    { id: "fileName", label: "File Name (URL)", minWidth: 200 },
    {
        id: "importDateTime",
        label: "importDateTime",
        minWidth: 170,
        format: (value) =>
            new Date(value).toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
            }),
    },
    { id: "total", label: "Total", minWidth: 80 },
    { id: "new", label: "New", minWidth: 80 },
    { id: "updated", label: "Updated", minWidth: 80 },
    { id: "failed", label: "Failed", minWidth: 80 },
];

const ImportLogs = () => {
    const [loading, setLoading] = useState(true);
    const [logs, setLogs] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        const fetchImportLogs = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/import-logs`);
                setLogs(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching import logs:', error);
            }
        };

        fetchImportLogs();
    }, []);

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    if (loading) return <p style={{ padding: "2rem" }}>Loading...</p>;
    return (
        <>
            <Paper sx={{ width: "100%", overflow: "hidden", p: 2 }}>
                <h2>📦 Import Logs</h2>
                <TableContainer sx={{ maxHeight: 500 }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                {columns.map((col) => (
                                    <TableCell
                                        key={col.id}
                                        style={{ minWidth: col.minWidth }}
                                        align={col.align || "left"}
                                        sx={{backgroundColor:"#E8E8E8"}}
                                    >
                                        {col.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {logs
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((log) => (
                                    <TableRow key={log._id} hover>
                                        {columns.map((col) => {
                                            const value = log[col.id];
                                            return (
                                                <TableCell key={col.id} align={col.align || "left"}>
                                                    {col.format ? col.format(value) : value}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    component="div"
                    count={logs.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

        </>
    )
}

export default ImportLogs
