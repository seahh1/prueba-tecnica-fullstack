import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, Toolbar, Avatar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';

const drawerWidth = 240;

function AppLayout() {
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
          <Box component="h1" sx={{ m: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
            SGDU
          </Box>
        </Toolbar>
        <List>
          {['Panel de control', 'Usuarios', 'Informes', 'Configuración'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton sx={{ '&:hover': { backgroundColor: 'primary.main' } }}>
                <ListItemIcon sx={{ color: 'white' }}>
                  {index === 0 && <DashboardIcon />}
                  {index === 1 && <PeopleIcon />}
                  {index === 2 && <BarChartIcon />}
                  {index === 3 && <SettingsIcon />}
                </ListItemIcon>
                {text}
              </ListItemButton>
            </ListItem>
          ))}
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
          <Avatar sx={{ bgcolor: 'secondary.main' }}>G</Avatar>
        </Toolbar>
        <Outlet /> 
      </Box>
    </Box>
  );
}

export default AppLayout;