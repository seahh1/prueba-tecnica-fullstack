import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Select, MenuItem, FormControl, InputLabel, CircularProgress,Typography, } from '@mui/material';
import { useUsers } from '../../store/UserContext';
import { toast } from 'react-toastify';

function UserFormModal({ open, handleClose, userToEdit }) {
  const { createUser, updateUser, isLoading } = useUsers();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    permisos: 'Basic',
    estatus: 'Active',
  });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (userToEdit) {
      setFormData({
        name: userToEdit.name || '',
        email: userToEdit.email || '',
        password: '',
        permisos: userToEdit.permisos || 'Basic',
        estatus: userToEdit.estatus || 'Active',
      });
      setIsEditMode(true);
    } else {
      setFormData({
        name: '', email: '', password: '', permisos: 'Operativo', estatus: 'Active',
      });
      setIsEditMode(false);
    }
  }, [userToEdit, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || (!isEditMode && !formData.password)) {
      toast.error('Por favor, completa todos los campos requeridos.');
      return;
    }

    try {
      if (isEditMode) {
        const dataToSend = { ...formData };
        if (!dataToSend.password) delete dataToSend.password;
        
        await updateUser(userToEdit._id, dataToSend);
      } else {
        await createUser(formData);
      }
      handleClose();
    } catch (error) {
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{isEditMode ? 'Editar Usuario' : 'Añadir Nuevo Usuario'}</DialogTitle>
      <DialogContent sx={{ minWidth: 400 }}>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Nombre *"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.name}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          name="email"
          label="Email *"
          type="email"
          fullWidth
          variant="outlined"
          value={formData.email}
          onChange={handleChange}
          disabled={isEditMode}
          sx={{ mb: 2 }}
        />
        {!isEditMode && ( 
          <TextField
            margin="dense"
            name="password"
            label="Contraseña *"
            type="password"
            fullWidth
            variant="outlined"
            value={formData.password}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
        )}
        {isEditMode && (
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            La contraseña no se edita directamente aquí por seguridad.
          </Typography>
        )}
        <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
          <InputLabel>Permisos *</InputLabel>
          <Select
            name="permisos"
            value={formData.permisos}
            label="Permisos *"
            onChange={handleChange}
          >
            <MenuItem value="Operativo">Operativo</MenuItem>
            <MenuItem value="Full">Full</MenuItem>
            <MenuItem value="Basico">Básico</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel>Estatus *</InputLabel>
          <Select
            name="estatus"
            value={formData.estatus}
            label="Estatus *"
            onChange={handleChange}
          >
            <MenuItem value="Active">Activo</MenuItem>
            <MenuItem value="Inactive">Inactivo</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined" disabled={isLoading}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} /> : (isEditMode ? 'Guardar Cambios' : 'Añadir Usuario')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UserFormModal;