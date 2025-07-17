import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, Toolbar, Avatar, Typography } from '@mui/material';
import { Outlet, Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../store/AuthContext';

const drawerWidth = 240;

function AppLayout() {
  const { logout, user } = useAuth();
  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: 'primary.dark',
            color: 'white',
          },
        }}
      >
        <Toolbar sx={{ justifyContent: 'center', py: 2 }}>
          <Typography variant="h5" component="h1" sx={{ m: 0, fontWeight: 'bold' }}>
            SGDU
          </Typography>
        </Toolbar>
        <List sx={{ flexGrow: 1 }}>
          {[{ text: 'Panel de control', icon: <DashboardIcon />, path: '/' },
            { text: 'Usuarios', icon: <PeopleIcon />, path: '/' },
            { text: 'Informes', icon: <BarChartIcon />, path: '/reports' },
             { text: 'Configuración', icon: <SettingsIcon />, path: '/settings' }
          ].map((item) => (
            <ListItem key={item.text + item.path} disablePadding>
              <ListItemButton component={Link} to={item.path} sx={{ '&:hover': { backgroundColor: 'primary.main' } }}>
                <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
                {item.text}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        
        <List>
            <ListItem disablePadding>
                <ListItemButton onClick={logout} sx={{ '&:hover': { backgroundColor: 'primary.main' } }}>
                    <ListItemIcon sx={{ color: 'white' }}>
                        <LogoutIcon />
                    </ListItemIcon>
                    Logout {user && `(${user.email})`}
                </ListItemButton>
            </ListItem>
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          width: `calc(100% - ${drawerWidth}px)`,
        }}
      >
        <Toolbar sx={{ justifyContent: 'flex-end' }}>
          <Avatar sx={{ bgcolor: 'secondary.main' }}>
            {user && user.email ? user.email.charAt(0).toUpperCase() : 'G'}
          </Avatar>
        </Toolbar>
        <Outlet /> 
      </Box>
    </Box>
  );
}

export default AppLayout;