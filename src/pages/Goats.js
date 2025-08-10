import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function Goats() {
  const [goats, setGoats] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/goats')
      .then(res => setGoats(res.data));
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Tag ID</TableCell>
            <TableCell>Breed</TableCell>
            <TableCell>Weight (kg)</TableCell>
            <TableCell>Health</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {goats.map(goat => (
            <TableRow key={goat.id}>
              <TableCell>{goat.tagId}</TableCell>
              <TableCell>{goat.breed}</TableCell>
              <TableCell>{goat.weight}</TableCell>
              <TableCell>{goat.healthStatus}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Goats;