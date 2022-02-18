// icon
import { Icon } from '@iconify/react';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import plusFill from '@iconify/icons-eva/plus-fill';
import editFill from '@iconify/icons-eva/edit-fill';
// mui
import {
  Button, Card, Container, Stack, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Typography, IconButton, Menu, MenuItem, ListItemIcon, ListItemText,
  Dialog, TextField, Box, CssBaseline, Autocomplete
} from '@mui/material';
// react
import { useEffect, useState } from 'react';
// router
import Page from 'src/components/Page';
// api
import { getRooms, checkRoom, activeRoom, disableRoom, createRoom, updateRoom } from 'src/services/room.context';
import { getEquipments, checkEquipment, activeEquipment, disableEquipment, createEquipment } from 'src/services/equipment.context';
import Label from 'src/components/Label';
import EnhancedTableHead from 'src/components/EnchancedTableHead';
import { filter } from 'lodash';
import EnchancedToolbar from 'src/components/EnchancedToolbar';
import SearchNotFound from 'src/components/SearchNotFound';
// form
import { useFormik } from 'formik';
import * as yup from 'yup';

export default function Equipment() {

  const [roomList, setRoomList] = useState([]);

  const loadRoomList = async () => {
    await getRooms()
      .then((response) => {
        console.log(response.data);
        setRoomList(response.data);
      });
  }

  const [equipmentList, setEquipmentList] = useState([]);

  const loadEquipmentList = async () => {
    await getEquipments()
      .then((response) => {
        console.log(response.data);
        setEquipmentList(response.data);
      });
  }

  useEffect(() => {

    loadEquipmentList();
  }, []);


  // table header
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('equipment_name');

  const TABLE_HEAD = [
    { id: 'equipment_name', label: 'Equipment Name', alignRight: false },
    { id: 'equipment_code', label: 'Equipment Code', alignRight: false },
    { id: 'room', label: 'Room', alignRight: false },
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
      return filter(array, (equipment) => equipment.equipment_name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
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
  const filteredUsers = applySortFilter(equipmentList, getComparator(order, orderBy), filterName);
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
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - equipmentList.length) : 0;
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

  // check equipment is active
  const [equipmentStatus, setEquipmentStatus] = useState();
  const checkCheckStatus = (id) => {
    checkEquipment(id)
      .then((response) => {
        setEquipmentStatus(response.data.is_active)
      })
  }
  // active equipment
  const handleActiveEquipment = async (id) => {
    await activeEquipment(id)
    await loadEquipmentList()
    handleElClose();
  }

  // disable equipment
  const handleDisableEquipment = async (id) => {
    await disableEquipment(id)
    await loadEquipmentList()
    handleElClose();
  };

  // add equipment
  const [addOpen, setAddOpen] = useState(false);
  const handleAddClick = () => {
    loadRoomList();
    setAddOpen(true);
  };
  const handleAddClose = () => {
    setAddOpen(false);
  };

  const top100Films = [
    { label: 'The Shawshank Redemption', year: 1994 },
    { label: 'The Godfather', year: 1972 },
    { label: 'The Godfather: Part II', year: 1974 },
    { label: 'The Dark Knight', year: 2008 },
    { label: '12 Angry Men', year: 1957 },
    { label: "Schindler's List", year: 1993 },
    { label: 'Pulp Fiction', year: 1994 },
    {
      label: 'The Lord of the Rings: The Return of the King',
      year: 2003,
    },
    { label: 'The Good, the Bad and the Ugly', year: 1966 },
    { label: 'Fight Club', year: 1999 },
    {
      label: 'The Lord of the Rings: The Fellowship of the Ring',
      year: 2001,
    },
    {
      label: 'Star Wars: Episode V - The Empire Strikes Back',
      year: 1980,
    },
    { label: 'Forrest Gump', year: 1994 },
    { label: 'Inception', year: 2010 },
    {
      label: 'The Lord of the Rings: The Two Towers',
      year: 2002,
    },
    { label: "One Flew Over the Cuckoo's Nest", year: 1975 },
    { label: 'Goodfellas', year: 1990 },
    { label: 'The Matrix', year: 1999 },
    { label: 'Seven Samurai', year: 1954 },
    {
      label: 'Star Wars: Episode IV - A New Hope',
      year: 1977,
    },
    { label: 'City of God', year: 2002 },
    { label: 'Se7en', year: 1995 },
    { label: 'The Silence of the Lambs', year: 1991 },
    { label: "It's a Wonderful Life", year: 1946 },
    { label: 'Life Is Beautiful', year: 1997 },
    { label: 'The Usual Suspects', year: 1995 },
    { label: 'Léon: The Professional', year: 1994 },
    { label: 'Spirited Away', year: 2001 },
    { label: 'Saving Private Ryan', year: 1998 },
    { label: 'Once Upon a Time in the West', year: 1968 },
    { label: 'American History X', year: 1998 },
    { label: 'Interstellar', year: 2014 },
    { label: 'Casablanca', year: 1942 },
    { label: 'City Lights', year: 1931 },
    { label: 'Psycho', year: 1960 },
    { label: 'The Green Mile', year: 1999 },
    { label: 'The Intouchables', year: 2011 },
    { label: 'Modern Times', year: 1936 },
    { label: 'Raiders of the Lost Ark', year: 1981 },
    { label: 'Rear Window', year: 1954 },
    { label: 'The Pianist', year: 2002 },
    { label: 'The Departed', year: 2006 },
    { label: 'Terminator 2: Judgment Day', year: 1991 },
    { label: 'Back to the Future', year: 1985 },
    { label: 'Whiplash', year: 2014 },
    { label: 'Gladiator', year: 2000 },
    { label: 'Memento', year: 2000 },
    { label: 'The Prestige', year: 2006 },
    { label: 'The Lion King', year: 1994 },
    { label: 'Apocalypse Now', year: 1979 },
    { label: 'Alien', year: 1979 },
    { label: 'Sunset Boulevard', year: 1950 },
    {
      label: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
      year: 1964,
    },
    { label: 'The Great Dictator', year: 1940 },
    { label: 'Cinema Paradiso', year: 1988 },
    { label: 'The Lives of Others', year: 2006 },
    { label: 'Grave of the Fireflies', year: 1988 },
    { label: 'Paths of Glory', year: 1957 },
    { label: 'Django Unchained', year: 2012 },
    { label: 'The Shining', year: 1980 },
    { label: 'WALL·E', year: 2008 },
    { label: 'American Beauty', year: 1999 },
    { label: 'The Dark Knight Rises', year: 2012 },
    { label: 'Princess Mononoke', year: 1997 },
    { label: 'Aliens', year: 1986 },
    { label: 'Oldboy', year: 2003 },
    { label: 'Once Upon a Time in America', year: 1984 },
    { label: 'Witness for the Prosecution', year: 1957 },
    { label: 'Das Boot', year: 1981 },
    { label: 'Citizen Kane', year: 1941 },
    { label: 'North by Northwest', year: 1959 },
    { label: 'Vertigo', year: 1958 },
    {
      label: 'Star Wars: Episode VI - Return of the Jedi',
      year: 1983,
    },
    { label: 'Reservoir Dogs', year: 1992 },
    { label: 'Braveheart', year: 1995 },
    { label: 'M', year: 1931 },
    { label: 'Requiem for a Dream', year: 2000 },
    { label: 'Amélie', year: 2001 },
    { label: 'A Clockwork Orange', year: 1971 },
    { label: 'Like Stars on Earth', year: 2007 },
    { label: 'Taxi Driver', year: 1976 },
    { label: 'Lawrence of Arabia', year: 1962 },
    { label: 'Double Indemnity', year: 1944 },
    {
      label: 'Eternal Sunshine of the Spotless Mind',
      year: 2004,
    },
    { label: 'Amadeus', year: 1984 },
    { label: 'To Kill a Mockingbird', year: 1962 },
    { label: 'Toy Story 3', year: 2010 },
    { label: 'Logan', year: 2017 },
    { label: 'Full Metal Jacket', year: 1987 },
    { label: 'Dangal', year: 2016 },
    { label: 'The Sting', year: 1973 },
    { label: '2001: A Space Odyssey', year: 1968 },
    { label: "Singin' in the Rain", year: 1952 },
    { label: 'Toy Story', year: 1995 },
    { label: 'Bicycle Thieves', year: 1948 },
    { label: 'The Kid', year: 1921 },
    { label: 'Inglourious Basterds', year: 2009 },
    { label: 'Snatch', year: 2000 },
    { label: '3 Idiots', year: 2009 },
    { label: 'Monty Python and the Holy Grail', year: 1975 },
  ];

  // create equipment form 
  const validationSchema = yup.object({
    equipment_name: yup
      .string('Enter Equipment Name')
      .required('Equipment Name is required'),
    equipment_code: yup
      .string('Enter Equipment Code')
      .required('Equipment Code is required'),
    room_id: yup
      .string('Enter Room')
      .required('Room is required'),
  });

  const formik = useFormik({
    initialValues: {
      equipment_name: '',
      equipment_code: '',
      room_id: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm, setSubmitting, setErrors }) => {
      setSubmitting(false);
      let resetControl = true;
      for (let x in equipmentList) {
        // console.log(equipmentList[x].equipment_name)
        let equipmentNameList = equipmentList[x].equipment_name
        if (values.equipment_name === equipmentNameList) {
          setErrors({ equipment_name: 'Equipment Name in used' });
          resetControl = false;
        }
        let equipmentCodeList = equipmentList[x].equipment_code
        if (values.equipment_code === equipmentCodeList) {
          setErrors({ equipment_code: 'Equipment Code in used' });
          resetControl = false;
        }
      }
      console.log(values.room_id)
      if (resetControl) {
        const equipment_name = values.equipment_name;
        const equipment_code = values.equipment_code;
        const room_id = values.room_id;

        // await createEquipment(equipment_name, equipment_code, room_id);
        await loadEquipmentList();
        resetForm();
        handleEditClose();
      }
    },
  });

  // edit room
  const [editRoom, setEditRoom] = useState({
    id: '',
    equipment_name: '',
    equipment_code: ''
  });
  const [editOpen, setEditOpen] = useState(false);
  const handleEditClick = (id) => {
    for (let x in equipmentList) {
      if (id === equipmentList[x].id) {
        let equipment_name = equipmentList[x].equipment_name;
        let equipment_code = equipmentList[x].equipment_code;
        setEditRoom({
          id: id,
          equipment_name: equipment_name,
          equipment_code: equipment_code
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
    equipment_name: yup
      .string('Enter Room Name')
      .required('Room name is required'),
    equipment_code: yup
      .string('Enter Equipment_code')
      .required('Equipment_code is required'),
  });

  // edit room form
  const editUserFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      equipment_name: editRoom.equipment_name,
      equipment_code: editRoom.equipment_code,
    },
    validationSchema: editValidationSchema,
    onSubmit: async (values, { resetForm, setSubmitting, setErrors }) => {
      setSubmitting(false);
      let resetControl = true;
      for (let x in equipmentList) {
        let roomNameList = equipmentList[x].equipment_name
        if (values.equipment_name === roomNameList) {
          if (values.equipment_name !== roomNameList) {
            setErrors({ equipment_name: 'Room Name in used' });
            resetControl = false;
          }
        }
      }
      if (resetControl) {
        const id = editRoom.id;
        const equipment_name = values.equipment_name;
        const equipment_code = values.equipment_code;
        await updateRoom(id, equipment_name, equipment_code);
        await loadEquipmentList();
        resetForm();
        handleEditClose();
      }
    },
  });

  return (
    <Page title="Equipment">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Equipment
          </Typography>
          <Button
            variant="contained"
            onClick={handleAddClick}
            startIcon={<Icon icon={plusFill} />}
          >
            New Equipment
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
                rowCount={equipmentList.length}
                onRequestSort={handleRequestSort}
              />
              {/* table body */}
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow
                      key={row.equipment_id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row" padding="normal" >
                        <Stack direction="row" alignItems="center" spacing={5}>
                          <Typography variant="subtitle2" noWrap >
                            {row.equipment_name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="left">{row.equipment_code}</TableCell>
                      <TableCell align="left">{row.room_name}</TableCell>
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
                          {equipmentStatus
                            ?
                            <MenuItem sx={{ color: 'text.secondary' }} onClick={() => { handleDisableEquipment(row.id) }}>
                              <ListItemIcon>
                                <Icon icon={trash2Outline} width={24} height={24} />
                              </ListItemIcon>
                              <ListItemText primary="Disable" primaryTypographyProps={{ variant: 'body2' }} />
                            </MenuItem>
                            :
                            <MenuItem sx={{ color: 'text.secondary' }} onClick={() => { handleActiveEquipment(row.id) }}>
                              <ListItemIcon>
                                <Icon icon={trash2Outline} width={24} height={24} />
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
              count={equipmentList.length}
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
                  id="equipment_name"
                  label="Room Name"
                  name="equipment_name"
                  autoComplete="equipment_name"
                  value={formik.values.equipment_name}
                  onChange={formik.handleChange}
                  error={formik.touched.equipment_name && Boolean(formik.errors.equipment_name)}
                  helperText={formik.touched.equipment_name && formik.errors.equipment_name}
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="equipment_code"
                  label="Equipment Code"
                  type="equipment_code"
                  id="equipment_code"
                  autoComplete="current-equipment_code"
                  value={formik.values.equipment_code}
                  onChange={formik.handleChange}
                  error={formik.touched.equipment_code && Boolean(formik.errors.equipment_code)}
                  helperText={formik.touched.equipment_code && formik.errors.equipment_code}
                />
                <Autocomplete
                  id="room_id"
                  name="room_id"
                  freeSolo
                  fullWidth
                  disableClearable
                  required
                  options={roomList.map((option) => option.room_name)}
                  renderInput={(params) => <TextField
                    {...params}
                    label="Room"
                    margin="normal"
                    error={formik.touched.room_id && Boolean(formik.errors.room_id)}
                    value={formik.values.room_id}
                    helperText={formik.touched.room_id && formik.errors.room_id}
                    onChange={formik.handleChange}
                  />}
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
                id="equipment_name"
                label="Room Name"
                name="equipment_name"
                autoComplete="equipment_name"
                value={editUserFormik.values.equipment_name}
                onChange={editUserFormik.handleChange}
                error={editUserFormik.touched.equipment_name && Boolean(editUserFormik.errors.equipment_name)}
                helperText={editUserFormik.touched.equipment_name && editUserFormik.errors.equipment_name}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="equipment_code"
                label="Equipment_code"
                type="equipment_code"
                id="equipment_code"
                autoComplete="current-equipment_code"
                value={editUserFormik.values.equipment_code}
                onChange={editUserFormik.handleChange}
                error={editUserFormik.touched.equipment_code && Boolean(editUserFormik.errors.equipment_code)}
                helperText={editUserFormik.touched.equipment_code && editUserFormik.errors.equipment_code}
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