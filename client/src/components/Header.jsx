import { motion } from 'framer-motion';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt, faTasks } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';

const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
    },
};

const dropdownVariants = {
    hover: {
        scale: 1.05,
        transition: { duration: 0.2 },
    },
};

export const Header = () => {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <motion.div variants={headerVariants} initial="hidden" animate="visible">
            <Navbar bg="light" expand="lg" className="shadow-sm mb-4">
                <Container>
                    <Navbar.Brand href="#" className="fw-bold text-primary">
                        <FontAwesomeIcon icon={faTasks} className="me-2" />
                        TodoApp
                    </Navbar.Brand>
                    
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <motion.div variants={dropdownVariants} whileHover="hover">
                                <NavDropdown
                                    title={
                                        <span>
                                            <FontAwesomeIcon icon={faUser} className="me-2" />
                                            {user?.firstName} {user?.lastName}
                                        </span>
                                    }
                                    id="user-nav-dropdown"
                                    align="end"
                                >
                                    <NavDropdown.Item disabled>
                                        <small className="text-muted">{user?.email}</small>
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={handleLogout}>
                                        <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                                        Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </motion.div>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </motion.div>
    );
};
