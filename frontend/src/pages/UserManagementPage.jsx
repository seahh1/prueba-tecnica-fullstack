import { Box, Typography, Button, Stack, TextField, Select, MenuItem, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid } from '@mui/x-data-grid';

const rows = [
  { id: 1, email: 'deanna.curtis@example.com', nombre: 'Jenny Wilson', banco: 'Santander', estatus: 'Activo', permisos: 'Operacional' },
  { id: 2, email: 'tanya.hill@example.com', nombre: 'Marvin McKinney', banco: 'BBVA', estatus: 'Activo', permisos: 'Completo' },
  { id: 3, email: 'jessica.hanson@example.com', nombre: 'Jerome Bell', banco: 'CBT', estatus: 'Activo', permisos: 'Basico' },
  { id: 4, email: 'kenzi.lawson@example.com', nombre: 'Cody Fisher', banco: 'Creditas', estatus: 'Inactivo', permisos: 'Operacional' },
];

const columns = [
  { field: 'email', headerName: 'Email', flex: 1.5 },
  { field: 'nombre', headerName: 'Nombre', flex: 1 },
  { field: 'banco', headerName: 'Banco', flex: 1 },
  { field: 'estatus', headerName: 'Estatus', flex: 0.7 },
  { field: 'permisos', headerName: 'Permisos de Empleado', flex: 1 },
  {
    field: 'acciones',
    headerName: 'Acciones',
    flex: 0.5,
    renderCell: () => <Button variant="outlined" size="small">Editar</Button>,
  },
];


function UserManagementPage() {
  return (
    <Box>

      <Alert severity="success" sx={{ mb: 2 }}>
        ¡Excelente! Usuario añadido correctamente.
      </Alert>

      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Lista de usuarios
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Añadir nuevo usuario
        </Button>
      </Stack>

      <Stack direction="row" spacing={2} mb={3}>
        <TextField label="Buscar nombre de usuario, correo electrónico..." variant="outlined" fullWidth />
        <Select defaultValue="all" sx={{ minWidth: 200 }}>
          <MenuItem value="all">Todos los permisos</MenuItem>
          <MenuItem value="operational">Operativo</MenuItem>
          <MenuItem value="full">Completo</MenuItem>
        </Select>
        <Button variant="contained" color="secondary">Buscar</Button>
      </Stack>

      <Box sx={{ height: 500, width: '100%', backgroundColor: 'background.paper', p: 2, borderRadius: 2 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection={false}
          disableSelectionOnClick
        />
      </Box>
    </Box>
  );
}

export default UserManagementPage;