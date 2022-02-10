// icon
import { Icon } from '@iconify/react';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import plusFill from '@iconify/icons-eva/plus-fill';
// mui
import {
  Button, Card, Container, Stack, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Typography, IconButton, Menu, MenuItem, ListItemIcon, ListItemText
} from '@mui/material';
// react
import { useEffect, useState } from 'react';
// router
import { Link as RouterLink } from 'react-router-dom';
import Page from '../components/Page';
// api
import { getForms } from '../services/form.context';
import Label from '../components/Label';
import EnhancedTableHead from '../components/EnchancedTableHead';
import { filter } from 'lodash';
import EnchancedToolbar from '../components/EnchancedToolbar';
import SearchNotFound from '../components/SearchNotFound';
export default function Form() {

  // api
  const [formItems, setFormItems] = useState([]);
  useEffect(() => {
    getForms()
      .then((response) => {
        // console.log(response.data);
        setFormItems(response.data);
      });
  }, []);


  // table header
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('username');


  const TABLE_HEAD = [
    { id: 'form_name', label: 'Form Name', alignRight: false },
    { id: 'created_by', label: 'Created By', alignRight: false },
    { id: 'equipment', label: 'Equipment', alignRight: false },
    { id: 'is_active', label: 'Status', alignRight: false },
    { id: '' }
  ];

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    if (query) {
      return filter(array, (form) => form.form_name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };



  // toolbar
  const [filterName, setFilterName] = useState('');
  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };
  const filteredForms = applySortFilter(formItems, getComparator(order, orderBy), filterName);
  const isUserNotFound = filteredForms.length === 0;

  // TablePagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - formItems.length) : 0;
  // more menu
  const [anchorEl, setAnchorEl] = useState(null);
  const handleElClick = (inputFormId, event) => {
    const obj = {
      inputFormId,
      element: event.currentTarget
    };
    setAnchorEl(obj);
  }
  const handleElClose = () => {
    setAnchorEl(null);
  }

  return (
    <Page title="Form">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Form
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="#"
            startIcon={<Icon icon={plusFill} />}
          >
            New Form
          </Button>
        </Stack>
        {/* main */}
        <Card>
          {/* Toolbar */}
          <EnchancedToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />
          {/* table */}
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              {/* table head */}
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={formItems.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
              />
              {/* table body */}
              <TableBody>
                {filteredForms
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row" padding="normal">
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Typography variant="subtitle2" noWrap>
                            {row.form_name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="left">{row.created_by["username"]}</TableCell>
                      <TableCell align="left">{row.equipments[0]["equipment_name"]}</TableCell>
                      <TableCell align="left">
                        <Label
                          variant="ghost"
                          color={row.is_active ? 'success' : 'error'}
                        >
                          {row.is_active ? 'Active' : 'Disabled'}
                        </Label>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          aria-label='more'
                          aria-controls="long-menu"
                          aria-expanded={anchorEl != null && anchorEl.inputFormId === row.id ? 'true' : undefined}
                          aria-haspopup="true"
                          onClick={(e) => handleElClick(row.id, e)}
                        >
                          <Icon icon={moreVerticalFill} width={20} height={20} />
                        </IconButton>
                        {/* more menu */}
                        <Menu
                          id={row.id}
                          anchorEl={anchorEl != null && anchorEl.element}
                          open={anchorEl != null && anchorEl.inputFormId === row.id}
                          onClose={handleElClose}
                          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        >
                          <MenuItem sx={{ color: 'text.secondary' }} onClick={() => { console.log(row.id) }}>
                            <ListItemIcon>
                              <Icon icon={trash2Outline} width={24} height={24} />
                            </ListItemIcon>
                            <ListItemText primary="Disable" primaryTypographyProps={{ variant: 'body2' }} />
                          </MenuItem>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  ))}
                {/* TablePagination */}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
              {isUserNotFound && (
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                      <SearchNotFound searchQuery={filterName} />
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
            {/* TablePagination */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={formItems.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </Card>
      </Container>
    </Page>
  );
}