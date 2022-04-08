// icon
import { Icon } from '@iconify/react';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import plusFill from '@iconify/icons-eva/plus-fill';
import editFill from '@iconify/icons-eva/edit-fill';
import eyeOffFIll from '@iconify/icons-eva/eye-off-fill';
import eyeFIll from '@iconify/icons-eva/eye-fill';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
// mui
import {
  Button, Card, Container, Stack, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Typography, IconButton, Menu, MenuItem, ListItemIcon, ListItemText,
  Dialog, TextField, Box, CssBaseline, Autocomplete, Input
} from '@mui/material';
// react
import { useEffect, useState } from 'react';
// router
import Page from 'src/components/Page';
// api
import { getRooms, checkRoom, activeRoom, disableRoom, createRoom, updateRoom, deleteRoom } from 'src/services/room.context';
import { getAnswers, checkAnswer, activeAnswer, disableAnswer, createAnswer, updateAnswer, deleteAnswer } from 'src/services/answer.context';
import { getUsers } from 'src/services/user.context';
import { getForms } from 'src/services/form.context';
import { getQuestions } from 'src/services/question.context';
import Label from 'src/components/Label';
import EnhancedTableHead from 'src/components/EnchancedTableHead';
import { filter } from 'lodash';
import EnchancedToolbar from 'src/components/EnchancedToolbar';
import SearchNotFound from 'src/components/SearchNotFound';
// form
import { useFormik } from 'formik';
import * as yup from 'yup';
//
import jwt_decode from "jwt-decode";

export default function Record() {

  const [answerList, setAnswerList] = useState([]);

  const loadAnswerList = async () => {
    await getAnswers()
      .then((response) => {
        setAnswerList(response.data);
      });
  }

  const [userList, setUserList] = useState([]);

  const loadUserList = async () => {
    await getUsers()
      .then((response) => {
        setUserList(response.data);
      });
  }
  const [formList, setFormList] = useState([]);

  const loadFormList = async () => {
    await getForms()
      .then((response) => {
        console.log(response.data)
        setFormList(response.data);
      });
  }
  const [questionList, setQuestionList] = useState([]);

  const loadQuestionList = async () => {
    await getQuestions()
      .then((response) => {
        setQuestionList(response.data);
      });
  }


  useEffect(() => {
    loadQuestionList();
    loadAnswerList();
    loadUserList();
    loadFormList();
  }, []);


  // table header
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('equipment_name');

  const TABLE_HEAD = [
    { id: 'equipment_name', label: 'Equipment Name', alignRight: false },
    { id: 'created_by', label: 'Created by', alignRight: false },
    { id: 'room_name', label: 'Room', alignRight: false },
    { id: 'question_text', label: 'Question', alignRight: false },
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

  // check answer is active
  const [answerStatus, setAnswerStatus] = useState();
  const checkCheckStatus = (id) => {
    checkAnswer(id)
      .then((response) => {
        setAnswerStatus(response.data.is_active)
      })
  }
  // active answer
  const handleActiveAnswer = async (id) => {
    await activeAnswer(id)
    await loadAnswerList()
    handleElClose();
  }

  // disable answer
  // const handleDisableAnswer = async (id) => {
  //   await disableAnswer(id)
  //   await loadAnswerList()
  //   handleElClose();
  // };

  const [createRecordInit, setCreateRecordInit] = useState({
    created_by: {},
  });

  // add answer
  const [addOpen, setAddOpen] = useState(false);
  const handleAddClick = () => {
    let user_id = jwt_decode(localStorage.getItem('token')).user_id
    let user
    for (let x in userList) {
      if (user_id === userList[x].id) {
        user = userList[x];
      }
    }

    setCreateRecordInit({
      created_by: user,
    })
    setUploadImageButton(false)
    setAddOpen(true);
  };
  const handleAddClose = () => {
    setAddOpen(false);
  };

  const [uploadImageButton, setUploadImageButton] = useState(false);

  // add record form 
  const validationSchema = yup.object({
    answer_text: yup
      .string('Enter your answer'),
  });


  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      created_by: createRecordInit.created_by,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm, setSubmitting, setErrors }) => {
      setSubmitting(false);

      const answer_text = values.answer_text;
      const form = values.form;
      const created_by = values.created_by;
      const question = values.question;
      const image = values.image;

      console.log({
        "answer_text": answer_text,
        "form": form,
        "created_by": created_by,
        "question": question,
        "image": image
      })

      await createAnswer(answer_text, form, created_by, question, image);
      await loadAnswerList();
      resetForm();
      handleAddClose();
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
  const handleDeleteAnswer = async (id) => {
    await deleteAnswer(id);
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
                      <TableCell align="left">{row.question_text}</TableCell>
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
                          {/* {answerStatus
                            ?
                            <MenuItem sx={{ color: 'text.secondary' }} onClick={() => { handleDisableAnswer(row.id) }}>
                              <ListItemIcon>
                                <Icon icon={eyeOffFIll} width={24} height={24} />
                              </ListItemIcon>
                              <ListItemText primary="Disable" primaryTypographyProps={{ variant: 'body2' }} />
                            </MenuItem>
                            :
                            <MenuItem sx={{ color: 'text.secondary' }} onClick={() => { handleActiveAnswer(row.id) }}>
                              <ListItemIcon>
                                <Icon icon={eyeFIll} width={24} height={24} />
                              </ListItemIcon>
                              <ListItemText primary="Active" primaryTypographyProps={{ variant: 'body2' }} />
                            </MenuItem>
                          } */}
                          {/* <MenuItem sx={{ color: 'text.secondary' }} onClick={() => { handleEditClick(row.id) }}>
                            <ListItemIcon>
                              <Icon icon={editFill} width={24} height={24} />
                            </ListItemIcon>
                            <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
                          </MenuItem> */}
                          <MenuItem sx={{ color: 'text.secondary' }} onClick={() => { handleDeleteAnswer(row.id) }}>
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

          {/* add record form */}
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
                Create Record
              </Typography>
              <form onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }} style={{
                width: 400,
              }}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="answer_text"
                  label="Answer"
                  name="answer_text"
                  value={formik.values.answer_text}
                  onChange={formik.handleChange}
                  error={formik.touched.answer_text && Boolean(formik.errors.answer_text)}
                  helperText={formik.touched.answer_text && formik.errors.answer_text}
                  autoFocus
                />

                <Autocomplete
                  id="form"
                  name="form"
                  required
                  fullWidth
                  options={formList}
                  getOptionLabel={(option) => option.form_name}
                  onChange={(e, value) => {
                    formik.setFieldValue('form', value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      required
                      label="Form"
                      margin="normal"
                      error={formik.touched.form && Boolean(formik.errors.form)}
                      helperText={formik.touched.form && formik.errors.form}
                    />
                  )}
                />
                <Autocomplete
                  id="created_by"
                  name="created_by"
                  required
                  fullWidth
                  value={formik.values.created_by}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  options={userList}
                  getOptionLabel={(option) => option.username}
                  onChange={(e, value) => {
                    formik.setFieldValue('created_by', value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      required
                      label="Created by"
                      margin="normal"
                      error={formik.touched.created_by && Boolean(formik.errors.created_by)}
                      helperText={formik.touched.created_by && formik.errors.created_by}
                    />
                  )}
                />
                <Autocomplete
                  id="question"
                  name="question"
                  required
                  fullWidth
                  options={questionList}
                  getOptionLabel={(option) => option.question_text}
                  onChange={(e, value) => {
                    formik.setFieldValue('question', value);
                    console.log(questionList[2])
                    console.log(value.id);
                    setUploadImageButton(questionList[2].id === value.id ? true : false)
                  }}

                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      required
                      label="Question"
                      margin="normal"
                      error={formik.touched.question && Boolean(formik.errors.question)}
                      helperText={formik.touched.question && formik.errors.question}
                    />
                  )}
                />
                {uploadImageButton ?
                  <Input
                    fullWidth
                    id="file"
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={(e, value) => {
                      formik.setFieldValue('image', e.currentTarget.files[0]);
                    }}
                  />
                  : ""}


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
      </Container >

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
    </Page >
  );
}