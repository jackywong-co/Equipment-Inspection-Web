// icon
import { Icon } from '@iconify/react';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import plusFill from '@iconify/icons-eva/plus-fill';
import editFill from '@iconify/icons-eva/edit-fill';
import eyeOffFIll from '@iconify/icons-eva/eye-off-fill';
import eyeFIll from '@iconify/icons-eva/eye-fill';
// mui
import {
  Button, Card, Container, Stack, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Typography, IconButton, Menu, MenuItem, ListItemIcon, ListItemText,
  Dialog, TextField, Box, CssBaseline
} from '@mui/material';
// react
import { useEffect, useState } from 'react';
// router
import Page from 'src/components/Page';
// api
import { getRooms, checkRoom, activeRoom, disableRoom, createRoom, updateRoom, deleteRoom } from 'src/services/room.context';
import { getAnswers,checkAnswer,activeAnswer,disableAnswer,createAnswer, } from 'src/services/answer.context';
import Label from 'src/components/Label';
import EnhancedTableHead from 'src/components/EnchancedTableHead';
import { filter } from 'lodash';
import EnchancedToolbar from 'src/components/EnchancedToolbar';
import SearchNotFound from 'src/components/SearchNotFound';
// form
import { useFormik } from 'formik';
import * as yup from 'yup';

export default function Record() {

  const [answerList, setAnswerList] = useState([]);

  const loadAnswerList = async () => {
    await getAnswers()
      .then((response) => {
        console.log(response.data);
        setAnswerList(response.data);
      });
  }

  useEffect(() => {
    loadAnswerList();
  }, []);


  // table header
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('equipment_name');

  const TABLE_HEAD = [
    { id: 'equipment_name', label: 'Equipment Name', alignRight: false },
    { id: 'created_by', label: 'Created by', alignRight: false },
    { id: 'room_name', label: 'Room', alignRight: false },
    { id: 'created_at', label: 'Created At', alignRight: false },
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
      return filter(array, (record) => record.equipment_name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
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
  const filteredUsers = applySortFilter(answerList, getComparator(order, orderBy), filterName);
  const isUserNotFound = filteredUsers.length === 0;

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
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - answerList.length) : 0;
  // more menu
  const [anchorEl, setAnchorEl] = useState(null);
  const handleElClick = (inputFormId, event) => {
    const obj = {
      inputFormId,
      element: event.currentTarget
    };
    setAnchorEl(obj);
    checkCheckStatus(inputFormId)
  };
  const handleElClose = () => {
    setAnchorEl(null);
  };

  // check record is active
  const [answerStatus, setAnswerStatus] = useState();
  const checkCheckStatus = (id) => {
    checkAnswer(id)
      .then((response) => {
        setAnswerStatus(response.data.is_active)
      })
  }
  // active room
  const handleActiveRoom = async (id) => {
    await activeRoom(id)
    await loadAnswerList()
    handleElClose();
  }

  // disable room
  const handleDisableRoom = async (id) => {
    await disableRoom(id)
    await loadAnswerList()
    handleElClose();
  };

  // add room
  const [addOpen, setAddOpen] = useState(false);
  const handleAddClick = () => {
    setAddOpen(true);
  };
  const handleAddClose = () => {
    setAddOpen(false);
  };

  // add room form 
  const validationSchema = yup.object({
    room_name: yup
      .string('Enter Room Name')
      .required('Room Name is required'),
    location: yup
      .string('Enter Location')
  });

  const formik = useFormik({
    initialValues: {
      room_name: '',
      location: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm, setSubmitting, setErrors }) => {
      setSubmitting(false);
      let resetControl = true;
      for (let x in answerList) {
        console.log(answerList[x].room_name)
        let roomNameList = answerList[x].room_name
        if (values.room_name === roomNameList) {
          setErrors({ room_name: 'Room Name in used' });
          resetControl = false;
        }
      }
      if (resetControl) {
        const room_name = values.room_name;
        const location = values.location;
        await createRoom(room_name, location);
        await loadAnswerList();
        resetForm();
        handleAddClose();
      }
    },
  });

  // edit room
  const [editRoom, setEditRoom] = useState({
    id: '',
    room_name: '',
    location: ''
  });
  const [editOpen, setEditOpen] = useState(false);
  const handleEditClick = (id) => {
    for (let x in answerList) {
      if (id === answerList[x].id) {
        let room_name = answerList[x].room_name;
        let location = answerList[x].location;
        setEditRoom({
          id: id,
          room_name: room_name,
          location: location
        });
      }
    }
    setEditOpen(true);
    handleElClose();
  }
  const handleEditClose = () => {
    setEditOpen(false);
  };
  const editValidationSchema = yup.object({
    room_name: yup
      .string('Enter Room Name')
      .required('Room name is required'),
    location: yup
      .string('Enter Location')
  });

  // edit room form
  const editUserFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      room_name: editRoom.room_name,
      location: editRoom.location,
    },
    validationSchema: editValidationSchema,
    onSubmit: async (values, { resetForm, setSubmitting, setErrors }) => {
      setSubmitting(false);
      let resetControl = true;
      for (let x in answerList) {
        let roomNameList = answerList[x].room_name
        if (values.room_name === roomNameList) {
          if (values.room_name !== roomNameList) {
            setErrors({ room_name: 'Room Name in used' });
            resetControl = false;
          }
        }
      }
      if (resetControl) {
        const id = editRoom.id;
        const room_name = values.room_name;
        const location = values.location;
        await updateRoom(id, room_name, location);
        await loadAnswerList();
        resetForm();
        handleEditClose();
      }
    },
  });
  const handleDeleteRoom = async (id) => {
    await deleteRoom(id);
    await loadAnswerList();
  }
  return (
    <Page title="Room">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Record
          </Typography>
          <Button
            variant="contained"
            onClick={handleAddClick}
            startIcon={<Icon icon={plusFill} />}
          >
            New Record
          </Button>
        </Stack>
        {/* main */}
        <Card>
          {/* Toolbar */}
          <EnchancedToolbar
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
                rowCount={answerList.length}
                onRequestSort={handleRequestSort}
              />
              {/* table body */}
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row" padding="normal" >
                        <Stack direction="row" alignItems="center" spacing={5}>
                          <Typography variant="subtitle2" noWrap >
                            {row.equipment_name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="left">{row.created_by.username}</TableCell>
                      <TableCell align="left">{row.room_name}</TableCell>
                      <TableCell align="left">{row.created_at}</TableCell>
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
                          {answerStatus
                            ?
                            <MenuItem sx={{ color: 'text.secondary' }} onClick={() => { handleDisableRoom(row.id) }}>
                              <ListItemIcon>
                                <Icon icon={eyeOffFIll} width={24} height={24} />
                              </ListItemIcon>
                              <ListItemText primary="Disable" primaryTypographyProps={{ variant: 'body2' }} />
                            </MenuItem>
                            :
                            <MenuItem sx={{ color: 'text.secondary' }} onClick={() => { handleActiveRoom(row.id) }}>
                              <ListItemIcon>
                                <Icon icon={eyeFIll} width={24} height={24} />
                              </ListItemIcon>
                              <ListItemText primary="Active" primaryTypographyProps={{ variant: 'body2' }} />
                            </MenuItem>
                          }
                          <MenuItem sx={{ color: 'text.secondary' }} onClick={() => { handleEditClick(row.id) }}>
                            <ListItemIcon>
                              <Icon icon={editFill} width={24} height={24} />
                            </ListItemIcon>
                            <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
                          </MenuItem>
                          <MenuItem sx={{ color: 'text.secondary' }} onClick={() => { handleDeleteRoom(row.id) }}>
                            <ListItemIcon>
                              <Icon icon={trash2Outline} width={24} height={24} />
                            </ListItemIcon>
                            <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
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
              count={answerList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </Card>
        {/* add dialoag form */}
        <Dialog open={addOpen} onClose={handleAddClose}>

          {/* add room form */}
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography component="h1" variant="h5">
                Create Room
              </Typography>
              <form onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="room_name"
                  label="Room Name"
                  name="room_name"
                  autoComplete="room_name"
                  value={formik.values.room_name}
                  onChange={formik.handleChange}
                  error={formik.touched.room_name && Boolean(formik.errors.room_name)}
                  helperText={formik.touched.room_name && formik.errors.room_name}
                  autoFocus
                />
                <TextField
                  margin="normal"
                  fullWidth
                  name="location"
                  label="Location"
                  type="location"
                  id="location"
                  autoComplete="current-location"
                  value={formik.values.location}
                  onChange={formik.handleChange}
                  error={formik.touched.location && Boolean(formik.errors.location)}
                  helperText={formik.touched.location && formik.errors.location}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={formik.isSubmitting}
                >
                  Submit
                </Button>
              </form>
            </Box>
          </Container>
        </Dialog>
      </Container>

      <Dialog open={editOpen} onClose={handleEditClose}>

        {/* edit user form */}
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h5">
              Edit Form
            </Typography>
            <form onSubmit={editUserFormik.handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="room_name"
                label="Room Name"
                name="room_name"
                autoComplete="room_name"
                value={editUserFormik.values.room_name}
                onChange={editUserFormik.handleChange}
                error={editUserFormik.touched.room_name && Boolean(editUserFormik.errors.room_name)}
                helperText={editUserFormik.touched.room_name && editUserFormik.errors.room_name}
              />
              <TextField
                margin="normal"
                fullWidth
                name="location"
                label="Location"
                type="location"
                id="location"
                autoComplete="current-location"
                value={editUserFormik.values.location}
                onChange={editUserFormik.handleChange}
                error={editUserFormik.touched.location && Boolean(editUserFormik.errors.location)}
                helperText={editUserFormik.touched.location && editUserFormik.errors.location}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={editUserFormik.isSubmitting}
              >
                Submit
              </Button>
            </form>
          </Box>
        </Container>
      </Dialog>
    </Page>
  );
}