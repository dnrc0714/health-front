import React from 'react';
import { IconButton, Typography, Drawer, List, ListItem, ListItemText, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

type HeaderProps = {
    handleNavigate: (path: string) => void;
    isLoggedIn: boolean;
    handleLogout: () => void;
    handleSidebarToggle: () => void;
    isSidebarOpen: boolean;
};

export default function Sidebar({ handleNavigate, isLoggedIn, handleLogout, handleSidebarToggle, isSidebarOpen } : HeaderProps) {
    const renderMenuItems = () => (
        <Box
            sx={{ width: 250 }}
            role="presentation"
        >
            <List>
                <ListItem onClick={() => handleNavigate('/post')}>
                    <ListItemText primary="게시판" />
                </ListItem>
                <ListItem onClick={() => handleNavigate('/schedule')}>
                    <ListItemText primary="운동 일정" />
                </ListItem>
                {!isLoggedIn ? (
                    <ListItem onClick={() => handleNavigate('/login')}>
                        <ListItemText primary="로그인" />
                    </ListItem>
                ) : (
                    <>
                        <ListItem onClick={() => handleNavigate('/mypage')}>
                            <ListItemText primary="마이페이지" />
                        </ListItem>
                        <ListItem onClick={handleLogout}>
                            <ListItemText primary="로그아웃" />
                        </ListItem>
                    </>
                )}
            </List>
        </Box>
    );

    return (
        <div>
            <Drawer
                anchor="left"
                open={isSidebarOpen}
                onClose={handleSidebarToggle}
                transitionDuration={300} // 애니메이션 시간 설정 (선택 사항)
            >
                <Box sx={{ display: 'flex', alignItems: 'center', padding: 1 }}>
                    <IconButton onClick={handleSidebarToggle}>
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        메뉴
                    </Typography>
                </Box>
                {renderMenuItems()}
            </Drawer>
        </div>
    );
}