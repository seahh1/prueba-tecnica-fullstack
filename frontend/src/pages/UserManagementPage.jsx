import React, { useState } from 'react';
import { Box, Typography, Button, Stack, TextField, Select, MenuItem, Alert, CircularProgress, Chip, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid } from '@mui/x-data-grid';
import { useUsers } from '../store/UserContext';
import UserFormModal from '../components/users/UserFormModal';
import { toast } from 'react-toastify';

function UserManagementPage() {
  const { users, isLoading, error, pagination, setPagination, searchTerm, setSearchTerm, permissionFilter, setPermissionFilter, deleteUser } = useUsers();

  const [openModal, setOpenModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null); 

  const handleOpenCreateModal = () => {
    setUserToEdit(null); 
    setOpenModal(true);
  };

  const handleOpenEditModal = (user) => {
    setUserToEdit(user);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setUserToEdit(null); 
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        await deleteUser(id);
      } catch (err) {
      }
    }
  };
  
  const columns = [
    { field: 'name', headerName: 'Nombre', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1.5 },
    { field: 'estatus', headerName: 'Estatus', flex: 0.7,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'Active' ? 'success' : 'error'}
          size="small"
          sx={{ textTransform: 'capitalize' }}
        />
      )
    },
    { field: 'permisos', headerName: 'Permisos de Empleado', flex: 1 },
    {
    field: 'acciones',
    headerName: 'Acciones',
    flex: 0.8,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <Box>
          <IconButton color="primary" onClick={() => handleOpenEditModal(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDeleteUser(params.row._id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
        )
      },
    ];
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Lista de usuarios
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreateModal}>
          Añadir nuevo usuario
        </Button>

      </Stack>

      <Stack direction="row" spacing={2} mb={3}>
        <TextField 
          label="Buscar nombre de usuario, correo electrónico..." 
          variant="outlined" 
          fullWidth 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select 
          value={permissionFilter || 'all'} 
          onChange={(e) => setPermissionFilter(e.target.value === 'all' ? '' : e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="all">Todos los permisos</MenuItem>
          <MenuItem value="Operational">Operativo</MenuItem>
          <MenuItem value="Completo">Full</MenuItem>
          <MenuItem value="Basic">Basico</MenuItem>
        </Select>
      </Stack>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!isLoading && error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error al cargar usuarios: {error.message || 'Error desconocido'}
        </Alert>
      )}

      {!isLoading && !error && (
        <Box sx={{ height: 500, width: '100%', backgroundColor: 'background.paper', p: 2, borderRadius: 2 }}>
          <DataGrid
            rows={users}
            columns={columns}
            getRowId={(row) => row._id}
            pageSize={pagination.limit}
            rowCount={pagination.totalPages * pagination.limit}
            paginationMode="server"
            onPageChange={(newPage) => setPagination(prev => ({ ...prev, page: newPage + 1 }))}
            onPageSizeChange={(newPageSize) => setPagination(prev => ({ ...prev, limit: newPageSize }))}
            page={pagination.page - 1} 
            rowsPerPageOptions={[5, 10, 20]}
            checkboxSelection={false}
            disableSelectionOnClick
          />
        </Box>
      )}

      <UserFormModal
        open={openModal}
        handleClose={handleCloseModal}
        userToEdit={userToEdit}
      />
    </Box>
  );
}

export default UserManagementPage;